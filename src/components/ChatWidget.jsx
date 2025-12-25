import { useState, useRef, useEffect } from 'react';
import { Sparkles, X, Send } from 'lucide-react';

// =============================================================================
// COMPONENT: ChatWidget - Global Floating Chatbot
// =============================================================================

const ChatWidget = () => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([
        {
            id: 1,
            type: 'ai',
            text: "Hello! I'm your Dalat travel companion. How is the weather there?"
        },
        {
            id: 2,
            type: 'user',
            text: "It's raining a bit."
        },
        {
            id: 3,
            type: 'ai',
            text: "Perfect weather for a cozy café visit! Would you like me to suggest some hidden gems with great Vietnamese coffee?"
        }
    ]);
    const [inputValue, setInputValue] = useState('');
    const messagesEndRef = useRef(null);

    // Auto-scroll to bottom when messages change
    useEffect(() => {
        if (messagesEndRef.current) {
            messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
        }
    }, [messages]);

    const handleSend = () => {
        if (inputValue.trim()) {
            const newMessage = {
                id: messages.length + 1,
                type: 'user',
                text: inputValue.trim()
            };
            setMessages([...messages, newMessage]);
            setInputValue('');

            // Simulate AI response (TODO: Connect to actual AI backend)
            setTimeout(() => {
                const aiResponse = {
                    id: messages.length + 2,
                    type: 'ai',
                    text: "That sounds wonderful! I'm processing your request. In a real implementation, I'd connect to an AI service here."
                };
                setMessages(prev => [...prev, aiResponse]);
            }, 1000);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    return (
        <div className="fixed bottom-6 right-6 z-50">
            {/* Chat Window */}
            <div
                className={`
                    absolute bottom-20 right-0
                    w-80 sm:w-90 h-96
                    bg-white/90 backdrop-blur-md
                    rounded-2xl shadow-2xl
                    flex flex-col
                    overflow-hidden
                    transition-all duration-300 ease-in-out
                    ${isOpen
                        ? 'opacity-100 translate-y-0 scale-100'
                        : 'opacity-0 translate-y-4 scale-95 pointer-events-none'
                    }
                `}
                role="dialog"
                aria-label="Chat with Dalat Guide"
                aria-hidden={!isOpen}
            >
                {/* Header */}
                <div className="flex items-center justify-between px-5 py-4 border-b border-foreground/10 bg-white/50">
                    <div className="flex items-center gap-2">
                        <Sparkles className="w-5 h-5 text-accent" strokeWidth={1.5} />
                        <h3 className="font-tenor text-lg text-foreground">Dalat Guide</h3>
                    </div>
                    <button
                        onClick={() => setIsOpen(false)}
                        className="
                            p-1.5 rounded-full
                            hover:bg-foreground/10
                            transition-colors duration-200
                        "
                        aria-label="Close chat"
                    >
                        <X className="w-5 h-5 text-foreground/60" strokeWidth={1.5} />
                    </button>
                </div>

                {/* Messages Body */}
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`
                                flex
                                ${message.type === 'user' ? 'justify-end' : 'justify-start'}
                            `}
                        >
                            <div
                                className={`
                                    max-w-[80%] px-4 py-2.5 rounded-2xl
                                    font-manrope text-sm leading-relaxed
                                    ${message.type === 'user'
                                        ? 'bg-primary text-white rounded-br-md'
                                        : 'bg-white text-foreground shadow-sm border border-foreground/5 rounded-bl-md'
                                    }
                                `}
                            >
                                {message.text}
                            </div>
                        </div>
                    ))}
                    <div ref={messagesEndRef} />
                </div>

                {/* Input Footer */}
                <div className="px-4 py-3 border-t border-foreground/10 bg-white/50">
                    <div className="flex items-center gap-2">
                        <input
                            type="text"
                            value={inputValue}
                            onChange={(e) => setInputValue(e.target.value)}
                            onKeyDown={handleKeyPress}
                            placeholder="Ask me anything..."
                            className="
                                flex-1 px-4 py-2.5
                                bg-background rounded-full
                                font-manrope text-sm text-foreground
                                placeholder:text-foreground/40
                                border border-transparent
                                focus:border-primary/30 focus:outline-none
                                transition-colors duration-200
                            "
                            aria-label="Type your message"
                        />
                        <button
                            onClick={handleSend}
                            disabled={!inputValue.trim()}
                            className={`
                                p-2.5 rounded-full
                                transition-all duration-200
                                ${inputValue.trim()
                                    ? 'bg-primary text-white hover:bg-primary/90 hover:scale-105'
                                    : 'bg-foreground/10 text-foreground/30 cursor-not-allowed'
                                }
                            `}
                            aria-label="Send message"
                        >
                            <Send className="w-4 h-4" strokeWidth={2} />
                        </button>
                    </div>
                </div>
            </div>

            {/* FAB Trigger Button */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className={`
                    w-14 h-14 rounded-full
                    flex items-center justify-center
                    shadow-lg
                    transition-all duration-300 ease-out
                    hover:scale-110 hover:shadow-xl
                    active:scale-95
                    ${isOpen
                        ? 'bg-foreground/80 rotate-180'
                        : 'bg-accent'
                    }
                `}
                aria-label={isOpen ? 'Close chat' : 'Open chat assistant'}
                aria-expanded={isOpen}
            >
                {isOpen ? (
                    <X className="w-6 h-6 text-white" strokeWidth={2} />
                ) : (
                    <Sparkles className="w-6 h-6 text-white" strokeWidth={2} />
                )}
            </button>
        </div>
    );
};

export default ChatWidget;
