import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '@/lib/mongodb';
import Internship from '@/models/Internship';
import mongoose, { Document, Model, Schema } from 'mongoose';

const SYSTEM_PROMPT = `You are a helpful, professional, and student-friendly Student Support Chatbot.
Your role is to answer queries ONLY related to:
1. Academics (subjects, study strategies, learning resources)
2. Internships (availability, matching internships based on user skills)
3. Jobs (job roles, required skills, preparation guidance, career paths)
4. Resume improvement (feedback, suggestions, best practices)

STRICT BOUNDARIES:
- Do NOT answer questions outside these domains (e.g., general knowledge, entertainment, personal advice unrelated to career/academics).
- If a query is outside scope, respond with exactly: "I can only help with academics, internships, jobs, and resume-related queries."

BEHAVIOR REQUIREMENTS:
- Provide concise, actionable, and structured answers.
- When suggesting internships or jobs: Match results based on the user's provided skills. If skills are not provided, ask a follow-up question.
- When suggesting resources: Recommend high-quality, relevant learning materials.
- When reviewing resumes: Provide specific, constructive improvements.

RETRIEVAL (RAG) INSTRUCTIONS:
- Use only the provided knowledge base (context given below).
- Do NOT generate unsupported or hallucinated information.
- If relevant information is not found in the context, respond with: "I couldn't find relevant information in the available resources."

INTERACTION STYLE:
- Be professional, helpful, and student-friendly.
- Ask clarifying questions when needed before giving recommendations.
- Prefer bullet points or structured outputs where applicable.`;

// Inline StudyResource model
interface IStudyResource {
  title: string;
  description: string;
  type: string;
  link: string;
  category: string;
}
interface IStudyResourceDocument extends IStudyResource, Document {}
const StudyResourceSchema = new Schema<IStudyResourceDocument>({
  title: String, description: String, type: String, link: String, category: String,
}, { collection: 'study_resources' });
const StudyResource: Model<IStudyResourceDocument> = 
  (mongoose.models.StudyResource as Model<IStudyResourceDocument>) || 
  mongoose.model<IStudyResourceDocument>('StudyResource', StudyResourceSchema);

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Messages are required' }, { status: 400 });
    }

    const lastMessage = messages[messages.length - 1].content;
    const apiKey = process.env.GEMINI_API_KEY;

    // Build RAG Context
    let contextStr = '';
    try {
      await connectToDatabase();
      const internships = await Internship.find({ status: 'Open' }).limit(10).lean();
      const resources = await StudyResource.find({}).limit(10).lean();
      
      contextStr = 'AVAILABLE INTERNSHIPS:\n';
      internships.forEach((i: any) => {
        contextStr += `- ${i.title} at ${i.company}. Skills: ${i.skillsRequired?.join(', ')}. Mode: ${i.mode}.\n`;
      });

      contextStr += '\nSTUDY RESOURCES:\n';
      resources.forEach((r: any) => {
        contextStr += `- [${r.type}] ${r.title}: ${r.description}. Link: ${r.link}\n`;
      });
    } catch (dbErr) {
      console.warn('Could not fetch DB for RAG:', dbErr);
    }

    if (!apiKey) {
      // Mock Fallback Logic
      const q = lastMessage.toLowerCase();
      
      // Strict boundaries check
      const outOfScopeKeywords = ['capital of', 'movie', 'weather', 'president', 'recipe', 'joke', 'who is'];
      if (outOfScopeKeywords.some(kw => q.includes(kw))) {
        return NextResponse.json({ content: "I can only help with academics, internships, jobs, and resume-related queries." });
      }

      let mockResponse = '';
      if (q.includes('resume')) {
        mockResponse = "To improve your resume:\n- Ensure contact info is at the top.\n- Use a professional summary.\n- List experiences in reverse chronological order.\n- Highlight skills relevant to the roles you're applying for.";
      } else if (q.includes('internship') || q.includes('job')) {
        if (!q.includes('python') && !q.includes('react') && !q.includes('machine learning') && !q.includes('sql') && !q.includes('java')) {
          mockResponse = "I can help you find internships. What specific skills or roles are you interested in?";
        } else {
          mockResponse = "Based on our records, here are some relevant opportunities:\n" + 
            (contextStr.includes('AVAILABLE INTERNSHIPS:\n-') ? contextStr.split('\nSTUDY RESOURCES:')[0] : "- We currently don't have matching internships in the DB. Try adding more skills.");
        }
      } else if (q.includes('academic') || q.includes('study') || q.includes('resource') || q.includes('learn')) {
        mockResponse = "Here are some helpful resources:\n" + 
          (contextStr.includes('STUDY RESOURCES:\n-') ? contextStr.split('STUDY RESOURCES:\n')[1] : "- Please check the Study Resources tab for more details.");
      } else {
        mockResponse = "I can only help with academics, internships, jobs, and resume-related queries. How can I assist you today?";
      }

      return NextResponse.json({ content: mockResponse });
    }

    // Call Gemini API
    const geminiPayload = {
      systemInstruction: {
        role: "system",
        parts: [{ text: SYSTEM_PROMPT + "\n\nKNOWLEDGE BASE:\n" + contextStr }]
      },
      contents: messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }))
    };

    const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(geminiPayload)
    });

    if (!res.ok) {
      const errData = await res.json();
      console.error('Gemini API Error:', errData);
      return NextResponse.json({ error: 'Failed to communicate with AI provider' }, { status: 500 });
    }

    const data = await res.json();
    const botReply = data.candidates?.[0]?.content?.parts?.[0]?.text || "I couldn't find relevant information in the available resources.";

    return NextResponse.json({ content: botReply });
  } catch (err) {
    console.error('[POST /api/chat]', err);
    return NextResponse.json({ error: 'Failed to process chat query' }, { status: 500 });
  }
}
