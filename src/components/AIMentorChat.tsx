import React, { useState, useEffect, useRef } from "react";
import { ChatMessage } from "../types";
import { Compass, Sparkles, Send, BookOpen, AlertCircle, Bot, User, Trash2, HelpCircle } from "lucide-react";

interface AIMentorChatProps {
  userId: string;
}

export default function AIMentorChat({ userId }: AIMentorChatProps) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [inputText, setInputText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>("");

  const chatBottomRef = useRef<HTMLDivElement>(null);

  // Quick preset templates to assist scholarly interaction
  const presets = [
    "I am stuck on TypeScript Generics constraints.",
    "Recommend priority roadmap topics for Backend roles.",
    "Draft an optimal study hours schedule for 12 hours/week.",
    "How do I prepare a capstone layout project for interview review?"
  ];

  // Fetch histories on mount
  useEffect(() => {
    fetchChatHistory();
  }, [userId]);

  useEffect(() => {
    // Auto scroll to chat bottom
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const fetchChatHistory = async () => {
    try {
      const res = await fetch(`/api/mentor/chat/history?userId=${userId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data);
      }
    } catch (e) {
      console.error("Failed to load chat history logs:", e);
    }
  };

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    setErrorMsg("");
    setIsLoading(true);

    // Append local student message immediately to improve UX responsiveness
    const tempUserMsg: ChatMessage = {
      id: "temp_" + Math.random().toString(),
      user_id: userId,
      sender: "user",
      text: textToSend,
      timestamp: new Date().toISOString()
    };
    setMessages((prev) => [...prev, tempUserMsg]);
    setInputText("");

    try {
      const res = await fetch("/api/mentor/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          text: textToSend,
          previousChat: messages.filter((m) => !m.id.startsWith("temp"))
        })
      });

      if (!res.ok) {
        throw new Error("Unable to contact Barnaby Sterling's server. Verify variables.");
      }

      const data = await res.json();
      if (data.success && Array.isArray(data.messages)) {
        // Swap temp messages and load real synced messages from DB
        fetchChatHistory();
      }

    } catch (err: any) {
      console.error(err);
      setErrorMsg("Faculty connection lost. Reverting conversation.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 animate-fade-in text-[#4E220F]">
      
      {/* Header banner */}
      <div className="border-b-4 border-[#4E220F] pb-4 mb-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="font-serif font-black text-3xl text-[#4E220F] flex items-center gap-2">
            <span className="p-1.5 bg-[#9D6638] text-white border-2 border-[#4E220F] rounded">
              <Bot className="w-6 h-6 animate-pulse" />
            </span>
            <span>Scholarly AI Mentor Workspace</span>
          </h1>
          <p className="text-xs font-bold text-[#9D6638] uppercase tracking-widest mt-1">
            Consult Barnaby Sterling for deep architectural, career & diagnostic recommendations
          </p>
        </div>

        <div className="text-right">
          <span className="inline-block text-[10px] uppercase font-bold text-amber-950 bg-[#B0BA99] border border-[#4E220F] px-2.5 py-1 rounded">
            Faculty Mentor: Barnaby Sterling
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Playbook preset prompt templates */}
        <div className="lg:col-span-4 bg-[#FAF6EB] p-5 border-4 border-[#4E220F] shadow-[3px_3px_0px_#4E220F] rounded-lg space-y-4">
          <h4 className="font-serif font-bold text-sm text-[#4E220F] uppercase pb-2 border-b border-[#4E220F] flex items-center gap-1.5">
            <HelpCircle className="w-4 h-4 text-[#9D6638]" />
            <span>Curricular Inquiries Playbook</span>
          </h4>
          <p className="text-[11px] font-semibold text-[#6D4230] leading-normal">
            Select an option below to immediately formulate an inquiry coordinates to the mentor:
          </p>
          <div className="space-y-2.5">
            {presets.map((p, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => !isLoading && handleSendMessage(p)}
                className="w-full text-left p-2.5 text-xs font-bold bg-[#F7F1DE] hover:bg-[#B0BA99]/40 border border-[#4E220F]/40 hover:border-[#4E220F] rounded transition-colors block text-amber-900 leading-snug"
              >
                “{p}”
              </button>
            ))}
          </div>

          <div className="bg-[#B0BA99]/30 p-3 border border-[#4E220F]/40 text-[10px] font-bold text-[#6D4230] rounded-md leading-relaxed">
            🌿 **Barnaby Statement**: "Scholars, do not hesitate to copy raw diagnostic compiler errors or schematics parameters into our discussion. We shall evaluate variables meticulously."
          </div>
        </div>

        {/* Chat Console container */}
        <div className="lg:col-span-8 bg-[#FAF6EB] border-4 border-[#4E220F] shadow-[4px_4px_0px_#4E220F] p-4 sm:p-6 rounded-lg flex flex-col justify-end min-h-[60vh] max-h-[75vh]">
          
          {/* Messages screen */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-2 mb-4 scrollbar">
            {messages.map((m: ChatMessage) => {
              const isUser = m.sender === "user";
              return (
                <div
                  key={m.id}
                  className={`flex ${isUser ? "justify-end" : "justify-start"} animate-fade-in`}
                >
                  <div
                    className={`max-w-[85%] p-4 border-2 border-[#4E220F] rounded-lg ${
                      isUser
                        ? "bg-[#9D6638] text-white shadow-[2px_2px_0px_#4E220F]"
                        : "bg-[#F7F1DE] text-[#4E220F] shadow-[2px_2px_0px_#4E220F]"
                    }`}
                  >
                    <div className="flex items-center space-x-1 text-[9px] font-mono font-bold uppercase mb-1.5 opacity-80">
                      {isUser ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5 text-[#9D6638]" />}
                      <span>{isUser ? "STUDENT SCHOLAR" : "AI ACADEMIC MENTOR"}</span>
                      <span>•</span>
                      <span>{new Date(m.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
                    </div>

                    <p className="text-xs sm:text-xs font-semibold leading-relaxed whitespace-pre-wrap">
                      {m.text}
                    </p>
                  </div>
                </div>
              );
            })}

            {isLoading && (
              <div className="flex justify-start animate-pulse">
                <div className="bg-[#FAF6EB] border border-[#4E220F]/40 p-3 rounded-lg text-xs font-bold italic text-[#6D4230]/70">
                  Barnaby Sterling is drafting strategic recommendations...
                </div>
              </div>
            )}

            {errorMsg && (
              <div className="bg-red-100 border border-red-800 text-red-900 text-xs font-bold p-2.5 rounded flex items-center space-x-2">
                <AlertCircle className="w-4 h-4 text-red-800 flex-shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <div ref={chatBottomRef} />
          </div>

          {/* Form write input */}
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSendMessage(inputText);
            }}
            className="flex gap-3 border-t-2 border-[#4E220F]/30 pt-4"
          >
            <input
              type="text"
              disabled={isLoading}
              placeholder="Ask Barnaby about types architectures, databases gaps..."
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              className="flex-1 px-4 py-2.5 bg-[#F7F1DE] border-2 border-[#4E220F] font-semibold text-xs focus:outline-none focus:bg-[#FFFDF6] disabled:opacity-50 rounded"
              id="chat_input_element"
            />
            <button
              type="submit"
              disabled={isLoading || !inputText.trim()}
              className="px-5 py-2.5 bg-[#9D6638] text-white font-bold border-2 border-[#4E220F] shadow-[2px_2px_0px_#4E220F] hover:translate-x-[-1px] disabled:opacity-50 rounded"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>

        </div>

      </div>
    </div>
  );
}
