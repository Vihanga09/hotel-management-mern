import React, { useState, useEffect, useRef } from 'react';
import { MessageCircle, Send, X, Bot, User } from 'lucide-react';
import axios from 'axios';

const ChatBot = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [message, setMessage] = useState("");
    const [chat, setChat] = useState([
        { role: "ai", text: "Hello! Welcome to Grand Horizon Hotel. How can I help you today?" }
    ]);
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef(null);

    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
        }
    }, [chat, loading]);

    const handleSend = async () => {
        if (!message.trim()) return;

        const userMessage = { role: "user", text: message };
        setChat((prev) => [...prev, userMessage]);
        setLoading(true);
        setMessage("");

        try {
            // Backend එක දුවන URL එක Port 5000 බව සහතික කරගන්න
            const res = await axios.post("http://localhost:5000/api/chatbot/chat", { message });
            const aiMessage = { role: "ai", text: res.data.reply };
            setChat((prev) => [...prev, aiMessage]);
        } catch (error) {
            console.error("Chat Error:", error);
            setChat((prev) => [...prev, { role: "ai", text: "සොරි මචං, Backend එකට කනෙක්ට් වෙන්න බැහැ! සර්වර් එක චෙක් කරන්න." }]);
        } finally {
            setLoading(false);
        }
    };

    return (
        /* දකුණු පැත්තට සහ අනිත් දේවල් වලට උඩින් පේන්න style tag එක පාවිච්චි කළා */
        <div style={{ 
            position: 'fixed', 
            bottom: '30px', 
            right: '30px', 
            zIndex: 999999, 
            fontFamily: "'Inter', sans-serif",
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'flex-end'
        }}>
            
            {/* Chat Window */}
            {isOpen && (
                <div style={{ 
                    width: '350px', 
                    height: '500px', 
                    marginBottom: '15px',
                    display: 'flex',
                    flexDirection: 'column'
                }} 
                className="bg-white border-0 rounded-2xl shadow-[0_20px_50px_rgba(0,0,0,0.3)] overflow-hidden animate-in fade-in slide-in-from-bottom-5">
                    
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-5 text-white flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-white/20 rounded-full">
                                <Bot size={22} />
                            </div>
                            <div>
                                <h3 className="font-bold text-base leading-none">Grand Horizon AI</h3>
                                <div className="text-[10px] text-blue-100 mt-1 flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full animate-ping"></span>
                                    Online Assistant
                                </div>
                            </div>
                        </div>
                        <button onClick={() => setIsOpen(false)} className="hover:rotate-90 transition-transform">
                            <X size={20} />
                        </button>
                    </div>
                    
                    {/* Messages Area */}
                    <div ref={scrollRef} className="flex-1 p-5 overflow-y-auto bg-gray-50 space-y-4 flex flex-col">
                        {chat.map((msg, index) => (
                            <div key={index} className={`flex items-end gap-2 ${msg.role === 'user' ? 'self-end' : 'self-start'}`}>
                                {msg.role === 'ai' && (
                                    <div className="w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 mb-1 border border-blue-200">
                                        <Bot size={14} />
                                    </div>
                                )}
                                <div className={`max-w-[85%] p-3 rounded-2xl text-sm ${
                                    msg.role === 'user' 
                                    ? 'bg-blue-600 text-white rounded-br-none shadow-md' 
                                    : 'bg-white text-gray-800 rounded-bl-none border border-gray-200 shadow-sm'
                                }`}>
                                    {msg.text}
                                </div>
                                {msg.role === 'user' && (
                                    <div className="w-7 h-7 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 mb-1 border border-indigo-200">
                                        <User size={14} />
                                    </div>
                                )}
                            </div>
                        ))}
                        {loading && (
                            <div className="self-start text-[10px] text-gray-400 italic px-2">AI is typing...</div>
                        )}
                    </div>

                    {/* Input Area */}
                    <div className="p-4 bg-white border-t flex items-center gap-2">
                        <input 
                            type="text" 
                            className="flex-1 bg-gray-100 border-0 rounded-full px-4 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none text-black"
                            placeholder="Type a message..."
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                        />
                        <button 
                            onClick={handleSend} 
                            disabled={!message.trim() || loading}
                            className="p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition disabled:opacity-50 shadow-md"
                        >
                            <Send size={16} />
                        </button>
                    </div>
                </div>
            )}

            {/* Main Toggle Button */}
            {!isOpen && (
                <button 
                    onClick={() => setIsOpen(true)}
                    className="p-4 rounded-full bg-blue-600 text-white shadow-2xl hover:bg-blue-700 transition-all transform hover:scale-110 active:scale-95"
                >
                    <MessageCircle size={30} />
                </button>
            )}
        </div>
    );
};

export default ChatBot;