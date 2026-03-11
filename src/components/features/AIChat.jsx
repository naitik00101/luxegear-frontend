import { useState, useRef, useEffect } from "react";
import { IoSparklesOutline, IoCloseOutline, IoSendOutline } from "react-icons/io5";
import "./AIChat.css";

const AI_RESPONSES = [
  "The Elite Concierge has identified several tier-one assets that match your profile. Shall we examine the Audio or Mechanical collections?",
  "The ProKey Mechanical Keyboard is a masterpiece of tactile precision. Its CNC aluminum chassis provides an unrivaled acoustic profile.",
  "For creators who demand absolute fidelity, the VisionCurve 4K stands as the industry standard. An essential addition to your workspace.",
  "SonicPro X1: The pinnacle of ANC technology. It doesn't just block noise; it creates a private sanctuary for your audio.",
  "Inventory analysis complete. The SwiftGlide Pro mouse represents the absolute limit of sensor precision currently available."
];

const AIChat = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([
    { role: "bot", text: "Welcome to Elite Concierge. How may I assist your collection today?" }
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const chatEndRef = useRef(null);

  const scrollToBottom = () => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = () => {
    if (!input.trim()) return;
    
    setMessages(prev => [...prev, { role: "user", text: input }]);
    setInput("");
    setIsTyping(true);
    
    setTimeout(() => {
      const response = AI_RESPONSES[Math.floor(Math.random() * AI_RESPONSES.length)];
      setMessages(prev => [...prev, { role: "bot", text: response }]);
      setIsTyping(false);
    }, 1500);
  };

  return (
    <div className={`ai-chat-container ${isOpen ? 'open' : ''}`}>
      {!isOpen && (
        <button className="ai-chat-trigger" onClick={() => setIsOpen(true)}>
          <IoSparklesOutline size={24} />
          <span className="trigger-text">Elite Concierge</span>
        </button>
      )}

      {isOpen && (
        <div className="ai-chat-window">
          <div className="ai-chat-header">
            <h3><IoSparklesOutline size={18} /> Elite Concierge</h3>
            <button onClick={() => setIsOpen(false)}><IoCloseOutline size={20} /></button>
          </div>
          <div className="ai-chat-messages">
            {messages.map((m, i) => (
              <div key={i} className={`chat-bubble ${m.role}`}>
                {m.text}
              </div>
            ))}
            {isTyping && (
              <div className="chat-bubble bot typing">
                <div className="typing-dots">
                  <span></span><span></span><span></span>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div className="ai-chat-input">
            <input 
              placeholder="Ask for recommendations..." 
              value={input} 
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSend()}
            />
            <button onClick={handleSend}><IoSendOutline size={18} /></button>
          </div>
        </div>
      )}
    </div>
  );
};

export default AIChat;
