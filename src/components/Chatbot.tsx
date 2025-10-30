"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MessageCircle } from "lucide-react";
import { useAuth } from "./AuthProvider";

interface Message {
  sender: "user" | "bot";
  text: string;
}

export default function Chatbot() {
  const user = useAuth();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    { sender: "bot", text: "Hey there! How can I help you today?" },
  ]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMsg: Message = { sender: "user", text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ 
            message: input,
            userId: user.profile?.id,
            type: "user"  }),
      });
      console.log(user.profile?.id);

      const data = await res.json();
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: data.response ?? "I'm not sure how to respond." },
      ]);
    } catch (err) {
      console.error(err);
      setMessages(prev => [
        ...prev,
        { sender: "bot", text: "Sorry, there was an issue reaching the server." },
      ]);
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") sendMessage();
  };

  return (
    <motion.div
      drag
      dragElastic={0.15}
      dragMomentum={false}
      className="fixed bottom-6 right-6 z-50"
    >
      {open ? (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="bg-white shadow-xl rounded-2xl flex flex-col border border-gray-200 h-[450px] w-[320px] overflow-hidden"
        >
          {/* Header */}
          <div className="bg-blue-600 text-white flex justify-between items-center p-3 cursor-move">
            <span className="font-semibold">Bridge Assistant</span>
            <button onClick={() => setOpen(false)} className="text-white">
              ✕
            </button>
          </div>

          {/* Chat messages */}
          <div className="flex-1 p-3 overflow-y-auto space-y-2 bg-gray-50 text-gray-700">
            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`flex ${
                  msg.sender === "user" ? "justify-end" : "justify-start"
                }`}
              >
                <div
                  className={`px-3 py-2 rounded-lg max-w-[75%] ${
                    msg.sender === "user"
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
            {loading && (
              <div className="text-gray-500 text-sm italic">Thinking...</div>
            )}
          </div>

          {/* Input */}
          <div className="border-t flex items-center p-2 bg-white text-gray-700">
            <input
              type="text"
              placeholder="Type your message..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-1 outline-none p-2 text-sm"
            />
            <button
              onClick={sendMessage}
              disabled={loading}
              className="bg-blue-600 text-white px-3 py-1.5 rounded-lg text-sm hover:bg-blue-700 disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </motion.div>
      ) : (
        <motion.button
          onClick={() => setOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg"
        >
          <MessageCircle className="w-6 h-6" />
        </motion.button>
      )}
    </motion.div>
  );
}
