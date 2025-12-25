/**
 * Enhanced Chatbot Component
 * Da Lat SmartRoute
 * 
 * Smart chatbot with context-aware responses
 */

import { useState, useRef, useEffect } from 'react';

const MessageBubble = ({ message, isUser }) => (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}>
        <div
            className={`max-w-[85%] rounded-2xl px-4 py-3 ${isUser
                    ? 'bg-gradient-to-r from-primary-400 to-primary-500 text-white shadow-md'
                    : 'bg-white text-slate-800 shadow-md border border-slate-100'
                }`}
        >
            {message.text && (
                <div className="text-sm whitespace-pre-wrap leading-relaxed">
                    {message.text.split('\n').map((line, i) => {
                        // Bold text between **
                        if (line.includes('**')) {
                            const parts = line.split('**');
                            return (
                                <div key={i} className="mb-1">
                                    {parts.map((part, j) =>
                                        j % 2 === 1 ? <strong key={j}>{part}</strong> : part
                                    )}
                                </div>
                            );
                        }
                        // Bullet points
                        if (line.trim().startsWith('•')) {
                            return <div key={i} className="ml-2 mb-0.5">{line}</div>;
                        }
                        return <div key={i} className="mb-1">{line}</div>;
                    })}
                </div>
            )}

            {message.places && message.places.length > 0 && (
                <div className="mt-3 space-y-2">
                    {message.places.map((place, idx) => (
                        <a
                            key={idx}
                            href={`/place/${place.id}`}
                            className="block bg-slate-50 hover:bg-slate-100 rounded-xl p-3 transition-colors"
                        >
                            <div className="flex items-start gap-2">
                                <span className="text-xl">
                                    {place.type === 'cafe' ? '☕' :
                                        place.type === 'waterfall' ? '💧' :
                                            place.type === 'viewpoint' ? '🏔️' :
                                                place.type === 'restaurant' ? '🍽️' :
                                                    place.type === 'garden' ? '🌸' : '📍'}
                                </span>
                                <div className="flex-1">
                                    <p className="font-semibold text-slate-800 text-sm">{place.name}</p>
                                    <p className="text-xs text-slate-500">
                                        {place.opening_hours?.start} - {place.opening_hours?.end}
                                        {place.price_range && <span className="ml-2">• {place.price_range}</span>}
                                    </p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            )}

            {message.googleLink && (
                <a
                    href={message.googleLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 mt-3 text-sm text-primary-600 hover:text-primary-700 font-medium"
                >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    Tìm trên Google
                </a>
            )}

            {message.suggestions && message.suggestions.length > 0 && (
                <div className="mt-3 flex flex-wrap gap-2">
                    <p className="text-xs text-slate-600 w-full mb-1">Gợi ý:</p>
                    {message.suggestions.map((s, i) => (
                        <button
                            key={i}
                            onClick={() => message.onSuggestionClick && message.onSuggestionClick(s)}
                            className="text-xs px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full hover:bg-primary-100 transition-colors"
                        >
                            {s}
                        </button>
                    ))}
                </div>
            )}
        </div>
    </div>
);

const Chatbot = ({ currentWeather, currentTemperature }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            text: `👋 **Chào bạn!** Tôi là trợ lý du lịch Đà Lạt với AI.

Tôi có thể giúp bạn:
• 🎯 Gợi ý địa điểm phù hợp
• 👕 Tư vấn trang phục theo thời tiết
• 🗺️ Lập kế hoạch hoạt động
• 💰 Tìm địa điểm theo ngân sách

Hãy hỏi tôi bất cứ điều gì về du lịch Đà Lạt!`,
            isUser: false
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);

    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    useEffect(() => {
        if (isOpen) inputRef.current?.focus();
    }, [isOpen]);

    const sendMessage = async (text) => {
        if (!text.trim()) return;

        setMessages(prev => [...prev, { text: text.trim(), isUser: true }]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    query: text.trim(),
                    context: {
                        weather: currentWeather,
                        temperature: currentTemperature
                    }
                })
            });

            const result = await response.json();

            const botMessage = {
                text: result.message,
                isUser: false,
                places: result.places || [],
                googleLink: result.google_search_link,
                suggestions: result.suggestions,
                onSuggestionClick: sendMessage
            };

            setMessages(prev => [...prev, botMessage]);
        } catch (error) {
            console.error('Chatbot error:', error);
            setMessages(prev => [...prev, {
                text: '😅 Xin lỗi, có lỗi xảy ra. Vui lòng thử lại sau.',
                isUser: false
            }]);
        } finally {
            setIsTyping(false);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    const quickSuggestions = [
        'Mặc gì hôm nay?',
        'Cafe view đẹp',
        'Làm gì khi mưa?',
        'Địa điểm rẻ'
    ];

    return (
        <>
            {/* Chat bubble */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`chatbot-bubble ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
                aria-label="Open chat"
            >
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <div className="absolute -top-1 -right-1 w-3 h-3 bg-nature-500 rounded-full animate-pulse" />
            </button>

            {/* Chat window */}
            {isOpen && (
                <div className="chatbot-window flex flex-col h-[550px]">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-400 via-nature-400 to-sky-400 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-xl">🤖</span>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">AI Travel Assistant</h3>
                                <p className="text-white/80 text-xs flex items-center gap-1">
                                    <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                    Đang hoạt động
                                </p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white text-2xl leading-none hover:rotate-90 transition-transform"
                        >
                            ×
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-slate-50 to-white">
                        {messages.map((msg, idx) => (
                            <MessageBubble key={idx} message={msg} isUser={msg.isUser} />
                        ))}

                        {isTyping && (
                            <div className="flex justify-start mb-4">
                                <div className="bg-white rounded-2xl px-4 py-3 shadow-md border border-slate-100">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                                        <span className="w-2 h-2 bg-primary-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick suggestions */}
                    {messages.length <= 2 && (
                        <div className="px-4 py-3 bg-white border-t border-slate-100">
                            <p className="text-xs text-slate-500 mb-2">Gợi ý nhanh:</p>
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {quickSuggestions.map((s, i) => (
                                    <button
                                        key={i}
                                        onClick={() => sendMessage(s)}
                                        className="text-xs px-3 py-1.5 bg-primary-50 text-primary-700 rounded-full 
                             whitespace-nowrap hover:bg-primary-100 transition-colors font-medium"
                                    >
                                        {s}
                                    </button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-200">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Hỏi về du lịch Đà Lạt..."
                                className="input flex-1 text-sm py-2.5"
                                disabled={isTyping}
                            />
                            <button
                                type="submit"
                                disabled={isTyping || !input.trim()}
                                className="btn-primary px-5 disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                                </svg>
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;
