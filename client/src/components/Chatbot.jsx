/**
 * Enhanced Chatbot Component
 * Da Lat SmartRoute
 * 
 * Smart chatbot with:
 * - Weather-based fashion advice
 * - Activity recommendations
 * - Web search fallback
 */

import { useState, useRef, useEffect } from 'react';

const MessageBubble = ({ message, isUser }) => (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
        <div
            className={`max-w-[85%] rounded-2xl px-4 py-3 ${isUser
                    ? 'bg-primary-500 text-white'
                    : 'bg-slate-100 text-slate-800'
                }`}
        >
            {message.text && (
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            )}

            {message.places && message.places.length > 0 && (
                <div className="mt-2 space-y-2">
                    {message.places.map((place, idx) => (
                        <a
                            key={idx}
                            href={`/place/${place.id}`}
                            className="block bg-white rounded-lg p-3 hover:bg-slate-50 transition-colors text-slate-700"
                        >
                            <p className="font-medium text-sm">{place.name}</p>
                            <p className="text-xs text-slate-500">
                                {place.opening_hours?.start} - {place.opening_hours?.end}
                            </p>
                        </a>
                    ))}
                </div>
            )}

            {message.fashionTip && (
                <div className="mt-2 bg-white/90 rounded-lg p-3">
                    <p className="text-sm font-medium text-slate-700 mb-1">Gợi ý trang phục:</p>
                    <p className="text-sm text-slate-600">{message.fashionTip}</p>
                </div>
            )}

            {message.googleLink && (
                <a
                    href={message.googleLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-sm text-primary-600 hover:underline"
                >
                    Tìm trên Google
                </a>
            )}
        </div>
    </div>
);

const Chatbot = ({ currentWeather }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            text: 'Xin chào! Tôi là trợ lý du lịch Đà Lạt. Bạn có thể hỏi tôi về:\n\n• Địa điểm tham quan\n• Quán cà phê, nhà hàng\n• Mặc gì hôm nay\n• Hoạt động phù hợp thời tiết',
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

    // Fashion advice based on weather
    const getFashionAdvice = (weather) => {
        const advice = {
            rainy: 'Nên mang áo khoác chống nước hoặc áo mưa. Đừng quên ô và giày không thấm nước. Thời tiết se lạnh nên mặc thêm áo len.',
            cloudy: 'Thời tiết mát mẻ, phù hợp mặc áo khoác nhẹ. Nếu đi ngoài trời nhiều, nên mang theo áo mưa phòng khi.',
            sunny: 'Trời nắng đẹp! Nên mặc đồ nhẹ, thoáng mát. Đừng quên kem chống nắng, kính râm và mũ.',
            clear: 'Thời tiết rất đẹp! Mặc đồ thoải mái, năng động. Thích hợp cho các hoạt động ngoài trời.'
        };
        return advice[weather] || advice.cloudy;
    };

    // Activity recommendations based on weather
    const getActivityAdvice = (weather) => {
        const activities = {
            rainy: 'Thời tiết mưa nên:\n• Thăm bảo tàng, gallery\n• Cà phê trong nhà view đẹp\n• Thưởng thức ẩm thực địa phương\n• Mua sắm tại các shop thời trang',
            cloudy: 'Thời tiết mát mẻ phù hợp:\n• Đi dạo quanh hồ Xuân Hương\n• Tham quan vườn hoa\n• Các điểm check-in ngoài trời\n• Cafe sân thượng',
            sunny: 'Trời đẹp, nên đi:\n• Thác nước (Datanla, Elephant)\n• Đỉnh Langbiang\n• Hồ Tuyền Lâm\n• Cầu Đất Farm, ZooDoo',
            clear: 'Thời tiết tuyệt vời cho:\n• Ngắm hoàng hôn tại các viewpoint\n• Picnic tại đồi\n• Tham quan kiến trúc cổ\n• Chợ đêm'
        };
        return activities[weather] || activities.cloudy;
    };

    const processQuery = async (query) => {
        const lowerQuery = query.toLowerCase();

        // Check for fashion queries
        if (lowerQuery.includes('mặc') || lowerQuery.includes('trang phục') ||
            lowerQuery.includes('quần áo') || lowerQuery.includes('thời trang') ||
            lowerQuery.includes('outfit') || lowerQuery.includes('wear')) {
            const weather = currentWeather || 'cloudy';
            return {
                success: true,
                message: `Với thời tiết ${weather === 'rainy' ? 'mưa' : weather === 'sunny' ? 'nắng' : 'nhiều mây'} ở Đà Lạt hôm nay:`,
                fashionTip: getFashionAdvice(weather),
                places: []
            };
        }

        // Check for activity queries
        if (lowerQuery.includes('làm gì') || lowerQuery.includes('hoạt động') ||
            lowerQuery.includes('đi đâu') || lowerQuery.includes('nên đi')) {
            const weather = currentWeather || 'cloudy';
            return {
                success: true,
                message: getActivityAdvice(weather),
                places: []
            };
        }

        // Default: call backend API
        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query })
            });
            return await response.json();
        } catch (error) {
            return {
                success: false,
                message: 'Có lỗi xảy ra. Vui lòng thử lại.',
                places: []
            };
        }
    };

    const sendMessage = async (text) => {
        if (!text.trim()) return;

        setMessages(prev => [...prev, { text: text.trim(), isUser: true }]);
        setInput('');
        setIsTyping(true);

        const result = await processQuery(text.trim());

        setMessages(prev => [...prev, {
            text: result.message,
            isUser: false,
            places: result.places || [],
            fashionTip: result.fashionTip,
            googleLink: result.google_search_link
        }]);

        setIsTyping(false);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    const suggestions = [
        'Mặc gì hôm nay?',
        'Cafe view đẹp',
        'Làm gì khi mưa?'
    ];

    return (
        <>
            {/* Chat bubble */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`chatbot-bubble ${isOpen ? 'scale-0 opacity-0' : 'scale-100 opacity-100'}`}
                aria-label="Open chat"
            >
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </button>

            {/* Chat window */}
            {isOpen && (
                <div className="chatbot-window flex flex-col h-[480px]">
                    {/* Header */}
                    <div className="bg-primary-500 p-4 flex items-center justify-between">
                        <div>
                            <h3 className="text-white font-semibold">Trợ lý Du lịch</h3>
                            <p className="text-primary-100 text-xs">Da Lat SmartRoute</p>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white text-2xl leading-none"
                        >
                            ×
                        </button>
                    </div>

                    {/* Messages */}
                    <div className="flex-1 overflow-y-auto p-4 bg-white">
                        {messages.map((msg, idx) => (
                            <MessageBubble key={idx} message={msg} isUser={msg.isUser} />
                        ))}

                        {isTyping && (
                            <div className="flex justify-start mb-3">
                                <div className="bg-slate-100 rounded-2xl px-4 py-3">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" />
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.15s' }} />
                                        <span className="w-2 h-2 bg-slate-400 rounded-full animate-bounce" style={{ animationDelay: '0.3s' }} />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Suggestions */}
                    {messages.length <= 2 && (
                        <div className="px-4 py-2 bg-slate-50 border-t border-slate-100 flex gap-2 overflow-x-auto">
                            {suggestions.map((s, i) => (
                                <button
                                    key={i}
                                    onClick={() => sendMessage(s)}
                                    className="text-xs px-3 py-1.5 bg-white border border-slate-200 rounded-full 
                           whitespace-nowrap hover:bg-slate-50 transition-colors"
                                >
                                    {s}
                                </button>
                            ))}
                        </div>
                    )}

                    {/* Input */}
                    <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-slate-100">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Hỏi gì đó..."
                                className="input flex-1 text-sm py-2.5"
                                disabled={isTyping}
                            />
                            <button
                                type="submit"
                                disabled={isTyping || !input.trim()}
                                className="btn-primary px-4 disabled:opacity-50"
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
