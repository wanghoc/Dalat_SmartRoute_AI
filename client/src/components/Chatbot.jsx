/**
 * ============================================================
 * CHATBOT COMPONENT
 * Smart Da Lat Tourism
 * ============================================================
 * 
 * Floating chat bubble with natural language query support
 * Integrates with backend for keyword matching and suggestions
 * 
 * @component Chatbot
 */

import { useState, useRef, useEffect } from 'react';

/**
 * Message bubble component
 */
const MessageBubble = ({ message, isUser }) => (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
        <div
            className={`max-w-[80%] rounded-2xl px-4 py-3 ${isUser
                    ? 'bg-gradient-to-r from-primary-500 to-primary-600 text-white rounded-br-sm'
                    : 'bg-gray-100 text-gray-800 rounded-bl-sm'
                }`}
        >
            {/* Text message */}
            {message.text && (
                <p className="text-sm whitespace-pre-wrap">{message.text}</p>
            )}

            {/* Place suggestions */}
            {message.places && message.places.length > 0 && (
                <div className="mt-3 space-y-2">
                    {message.places.map((place, idx) => (
                        <a
                            key={idx}
                            href={place.directions_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="block bg-white/90 rounded-xl p-3 hover:bg-white transition-colors"
                        >
                            <div className="flex items-center gap-2">
                                <span className="text-2xl">
                                    {place.type === 'cafe' ? '☕' :
                                        place.type === 'waterfall' ? '💧' :
                                            place.type === 'viewpoint' ? '🏔️' :
                                                place.type === 'restaurant' ? '🍽️' : '📍'}
                                </span>
                                <div>
                                    <p className="font-medium text-gray-800 text-sm">{place.name}</p>
                                    <p className="text-gray-500 text-xs">{place.opening_hours?.start} - {place.opening_hours?.end}</p>
                                </div>
                            </div>
                        </a>
                    ))}
                </div>
            )}

            {/* Google Search fallback link */}
            {message.googleLink && (
                <a
                    href={message.googleLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 mt-2 text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                    🔍 Tìm trên Google
                </a>
            )}
        </div>
    </div>
);

/**
 * Quick suggestion chips
 */
const SuggestionChip = ({ text, onClick }) => (
    <button
        onClick={() => onClick(text)}
        className="bg-white/80 hover:bg-white text-gray-700 text-xs px-3 py-2 rounded-full 
               border border-gray-200 hover:border-primary-300 transition-all duration-200
               whitespace-nowrap"
    >
        {text}
    </button>
);

/**
 * Chatbot Component
 */
const Chatbot = () => {
    // State management
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            text: '👋 Xin chào! Tôi có thể giúp bạn tìm địa điểm tham quan ở Đà Lạt. Hãy hỏi tôi về:\n\n• Quán cà phê\n• Thác nước\n• Địa điểm mở cửa lúc 10 PM\n• Nơi đi khi trời mưa',
            isUser: false
        }
    ]);
    const [input, setInput] = useState('');
    const [isTyping, setIsTyping] = useState(false);
    const [suggestions, setSuggestions] = useState([]);

    // Refs
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    /**
     * Auto-scroll to bottom when new messages arrive
     */
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    /**
     * Fetch suggestions from API on mount
     */
    useEffect(() => {
        const fetchSuggestions = async () => {
            try {
                const response = await fetch('/api/chatbot/suggestions');
                const data = await response.json();
                if (data.success) {
                    setSuggestions(data.suggestions);
                }
            } catch (error) {
                console.error('Failed to fetch suggestions:', error);
                // Default suggestions
                setSuggestions([
                    'Quán cà phê view đẹp?',
                    'Đi đâu lúc 10 PM?',
                    'Thác nước nào đẹp?'
                ]);
            }
        };
        fetchSuggestions();
    }, []);

    /**
     * Focus input when chat opens
     */
    useEffect(() => {
        if (isOpen) {
            inputRef.current?.focus();
        }
    }, [isOpen]);

    /**
     * Send message to chatbot API
     */
    const sendMessage = async (text) => {
        if (!text.trim()) return;

        // Add user message
        const userMessage = { text: text.trim(), isUser: true };
        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsTyping(true);

        try {
            const response = await fetch('/api/chatbot', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ query: text.trim() })
            });

            const data = await response.json();

            // Create bot response
            const botMessage = {
                text: data.message,
                isUser: false,
                places: data.places || [],
                googleLink: data.google_search_link
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

    /**
     * Handle form submission
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        sendMessage(input);
    };

    /**
     * Handle suggestion click
     */
    const handleSuggestionClick = (text) => {
        sendMessage(text);
    };

    return (
        <>
            {/* Floating chat bubble button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`chatbot-bubble ${isOpen ? 'scale-0' : 'scale-100'}`}
                aria-label="Open chat"
            >
                <span className="text-2xl">💬</span>
            </button>

            {/* Chat window */}
            {isOpen && (
                <div className="chatbot-window glass flex flex-col">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-primary-500 to-accent-500 p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                                <span className="text-xl">🌸</span>
                            </div>
                            <div>
                                <h3 className="text-white font-semibold">Trợ lý Du lịch Đà Lạt</h3>
                                <p className="text-white/80 text-xs">Luôn sẵn sàng hỗ trợ bạn</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="text-white/80 hover:text-white text-2xl leading-none"
                            aria-label="Close chat"
                        >
                            ×
                        </button>
                    </div>

                    {/* Messages area */}
                    <div className="flex-1 overflow-y-auto p-4 bg-gradient-to-b from-gray-50 to-white">
                        {messages.map((msg, idx) => (
                            <MessageBubble key={idx} message={msg} isUser={msg.isUser} />
                        ))}

                        {/* Typing indicator */}
                        {isTyping && (
                            <div className="flex justify-start mb-3">
                                <div className="bg-gray-100 rounded-2xl px-4 py-3 rounded-bl-sm">
                                    <div className="flex gap-1">
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                                        <span className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div ref={messagesEndRef} />
                    </div>

                    {/* Quick suggestions */}
                    {messages.length <= 2 && suggestions.length > 0 && (
                        <div className="p-3 bg-gray-50 border-t border-gray-100">
                            <div className="flex gap-2 overflow-x-auto pb-1">
                                {suggestions.slice(0, 4).map((suggestion, idx) => (
                                    <SuggestionChip
                                        key={idx}
                                        text={suggestion}
                                        onClick={handleSuggestionClick}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Input area */}
                    <form onSubmit={handleSubmit} className="p-4 bg-white border-t border-gray-100">
                        <div className="flex gap-2">
                            <input
                                ref={inputRef}
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                placeholder="Hỏi về địa điểm du lịch..."
                                className="input flex-1 text-sm"
                                disabled={isTyping}
                            />
                            <button
                                type="submit"
                                disabled={isTyping || !input.trim()}
                                className="bg-gradient-to-r from-primary-500 to-accent-500 text-white px-4 py-2 
                           rounded-xl font-medium disabled:opacity-50 disabled:cursor-not-allowed
                           hover:shadow-lg transition-all duration-300"
                            >
                                📤
                            </button>
                        </div>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chatbot;
