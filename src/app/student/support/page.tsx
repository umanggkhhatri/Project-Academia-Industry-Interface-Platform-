"use client";

import Link from "next/link";
import Card from "@/components/ui/Card";
import { MessageSquare } from "lucide-react";
import { useAuth } from "@/components/providers/AuthProvider";
// Removed unused state and types

export default function StudentSupportPage() {
  const { user } = useAuth();
  const isAuthed = user?.role === "student";

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
          <>
            {/* Static Support Chat
            <Card className="bg-white p-4 shadow-[0_2px_6px_rgba(0,0,0,0.08)] mb-6">
              <div className="h-[55vh] overflow-y-auto p-3 bg-[#F7FAFF] rounded-md border border-[#E5E7EB]">
                <ul className="space-y-3">
                  {messages.map((m) => (
                    <li key={m.id} className={`flex ${m.from === "student" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[75%] p-2 rounded-md text-sm md:text-base ${m.from === "student" ? "bg-[#E6F0FA] text-[#1A1A1A]" : "bg-white border border-[#E5E7EB] text-[#1A1A1A]"}`}>
                        <div className="font-medium mb-1 text-xs text-[#666666]">{m.from === "student" ? "You" : "Support"} • {m.time}</div>
                        <div>{m.text}</div>
                      </div>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="mt-3 flex items-center gap-2">
                <input
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Type your message..."
                  className="flex-1 px-3 py-2 rounded-md border border-[#E5E7EB] bg-white outline-none focus:ring-2 focus:ring-[#0056A3]"
                />
                <button
                  onClick={sendMessage}
                  className="px-4 py-2 rounded-md bg-[#0056A3] text-white hover:bg-[#003D73] transition-colors"
                >
                  Send
                </button>
              </div>
              <p className="text-xs text-[#666666] mt-2">This chat connects you to our helpdesk. Please avoid sharing sensitive information.</p>
            </Card> */}

            {/* AI Chatbot Integration */}
            <Card className="bg-white p-0 shadow-[0_2px_6px_rgba(0,0,0,0.08)]">
              <iframe
                src="https://intern-mentor-bot.vercel.app/"
                style={{ width: "100%", height: "500px", border: "none", borderRadius: "10px" }}
                title="Intern Mentor Bot"
                loading="lazy"
              ></iframe>
            </Card>
          </>
        )}
      </div>
    </main>
  );
}
