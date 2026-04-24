"use client";

import Link from "next/link";
import { useState, useRef, useEffect } from "react";
import Card from "@/components/ui/Card";
import { MessageSquare, Send, Loader2 } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";

type Message = {
  id: string;
  role: "user" | "bot";
  content: string;
  time: string;
};

export default function StudentSupportPage() {
  const { user } = useAuth();
  const isAuthed = user?.role === "student";

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "bot",
      content: "Hello! I can help you with academics, internships, jobs, and resume-related queries. How can I assist you today?",
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, userMessage] })
      });

      if (!res.ok) throw new Error("Failed to send message");

      const data = await res.json();
      
      const botMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: data.content || "Sorry, I couldn't process that.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error(error);
      const errorMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: "bot",
        content: "Oops! Something went wrong. Please try again later.",
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-[calc(100vh-64px)] bg-[#F0F4FA] py-10">
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl md:text-3xl font-bold text-[#1A1A1A] flex items-center gap-2">
            <MessageSquare className="h-6 w-6 text-[#0056A3]" /> Student Support Chat
          </h1>
          <Link href="/student/dashboard" className="text-[#0056A3] hover:text-[#003D73]">Back to Dashboard</Link>
        </div>

        {!isAuthed && (
          <div className="bg-white border-l-4 border-[#0277BD] rounded-md p-4 mb-6" role="alert" aria-live="polite">
            <p className="text-[#333333] text-sm md:text-base">
              You are not logged in as a student. Please
              <Link href="/login/student" className="underline ml-1 text-[#0056A3] hover:text-[#003D73]">login</Link>.
            </p>
          </div>
        )}

        {isAuthed && (
          <Card className="bg-white p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)] mb-6 flex flex-col h-[70vh]">
            <div className="flex-1 overflow-y-auto p-4 bg-[#F7FAFF] rounded-md border border-[#E5E7EB] mb-4">
              <ul className="space-y-4">
                {messages.map((m) => (
                  <li key={m.id} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[75%] p-3 rounded-lg text-sm md:text-base shadow-sm ${m.role === "user" ? "bg-[#0056A3] text-white rounded-br-none" : "bg-white border border-[#E5E7EB] text-[#1A1A1A] rounded-bl-none"}`}>
                      <div className={`font-medium mb-1 text-xs opacity-80 ${m.role === "user" ? "text-blue-100" : "text-[#666666]"}`}>
                        {m.role === "user" ? "You" : "Support Bot"} • {m.time}
                      </div>
                      <div className="whitespace-pre-wrap">{m.content}</div>
                    </div>
                  </li>
                ))}
                {isLoading && (
                  <li className="flex justify-start">
                    <div className="max-w-[75%] p-3 rounded-lg text-sm md:text-base shadow-sm bg-white border border-[#E5E7EB] text-[#666666] rounded-bl-none flex items-center gap-2">
                      <Loader2 className="h-4 w-4 animate-spin text-[#0056A3]" />
                      <span>Thinking...</span>
                    </div>
                  </li>
                )}
                <div ref={messagesEndRef} />
              </ul>
            </div>
            <div className="flex items-center gap-2">
              <input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    sendMessage();
                  }
                }}
                disabled={isLoading}
                placeholder="Ask about internships, jobs, or resume help..."
                className="flex-1 px-4 py-3 rounded-md border border-[#E5E7EB] bg-white outline-none focus:ring-2 focus:ring-[#0056A3] disabled:opacity-50"
              />
              <button
                onClick={sendMessage}
                disabled={isLoading || !input.trim()}
                className="px-6 py-3 rounded-md bg-[#0056A3] text-white hover:bg-[#003D73] transition-colors disabled:bg-[#A0C0E0] disabled:cursor-not-allowed flex items-center gap-2"
              >
                <Send className="h-4 w-4" />
                <span className="hidden sm:inline">Send</span>
              </button>
            </div>
            <p className="text-xs text-[#666666] mt-3 text-center">This chat connects you to our AI helpdesk trained on platform resources.</p>
          </Card>
        )}
      </div>
    </main>
  );
}
