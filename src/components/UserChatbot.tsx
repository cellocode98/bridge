"use client";
import { useState, useRef } from "react";
import Draggable from "react-draggable";

export default function UserChatbot() {
  const [messages, setMessages] = useState<{ role: string; text: string }[]>([]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);

  // 👇 Create a ref that will be attached directly to a DOM node
  const dragRef = useRef<HTMLDivElement>(null);

  const sendMessage = async () => {
    if (!input) return;
    const newMessages = [...messages, { role: "user", text: input }];
    setMessages(newMessages);
    setInput("");

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: newMessages }),
      });
      const data = await res.json();
      setMessages((prev) => [...prev, { role: "assistant", text: data.reply }]);
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  return (
    // ✅ nodeRef MUST be passed to Draggable *and* attached to a native DOM element
    <Draggable nodeRef={dragRef}>
      <div ref={dragRef} className="fixed bottom-4 right-4 z-50"> 
        {!open ? (
          <button
            onClick={() => setOpen(true)}
            className="bg-blue-600 text-white rounded-full w-14 h-14 shadow-lg flex items-center justify-center text-xl"
          >
            💬
          </button>
        ) : (
          <div className="w-80 bg-white p-4 rounded-xl shadow-lg text-gray-700">
            <div className="flex justify-between items-center mb-2">
              <span>User Chat</span>
              <button
                onClick={() => setOpen(false)}
                className="text-gray-600 font-bold"
              >
                ✖
              </button>
            </div>
            <div className="h-60 overflow-y-auto mb-2">
              {messages.map((m, i) => (
                <div key={i} className={m.role === "user" ? "text-right" : "text-left"}>
                  <p className="p-1 rounded">{m.text}</p>
                </div>
              ))}
            </div>
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && sendMessage()}
              placeholder="Ask a question..."
              className="w-full border rounded p-2"
            />
          </div>
        )}
      </div>
    </Draggable>
  );
}
