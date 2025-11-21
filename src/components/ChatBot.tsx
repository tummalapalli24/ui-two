import { useState, useRef, useEffect } from "react";
import { Send, X, Minimize2, Activity } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";
import chatbotIcon from "@/assets/chatbot-icon.png";
import botMessageIcon from "@/assets/bot-message-icon.png";
import { Sources } from "./Sources";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
  messageId?: string;
  intLinks?: string[];
  extLinks?: string[];
}

export const ChatBot = () => {
  const initialMessage = {
    id: 1,
    text: "Hello! I'm Information Navigator, your virtual assistant. How can I help you today?",
    isBot: true,
    timestamp: new Date(),
  };

  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([initialMessage]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

  const handleClose = () => {
    setIsOpen(false);
    setMessages([{ ...initialMessage, id: 1, timestamp: new Date() }]);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || isLoading) return;

    const userMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      isBot: false,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    const query = inputValue;
    setInputValue("");
    setIsLoading(true);

    try {
      const response = await fetch(
        `http://52.54.56.23:7860/ask?query=${encodeURIComponent(query)}`
      );

      if (!response.ok) {
        throw new Error(`Failed to get response from server (status ${response.status})`);
      }

      const data = await response.json();

      const botMessage: Message = {
        id: messages.length + 2,
        text:
          data.answer ||
          data.response ||
          data.message ||
          "I received your question but couldn't generate a response.",
        isBot: true,
        timestamp: new Date(),
        messageId: data.messageId || `msg-${Date.now()}`,
        intLinks: data.intLinks || [],
        extLinks: data.extLinks || [],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error calling API:", error);
      toast({
        title: "Error",
        description: "Failed to get response. Please try again.",
        variant: "destructive",
      });

      const errorMessage: Message = {
        id: messages.length + 2,
        text: "Sorry, I'm having trouble connecting. Please try again later.",
        isBot: true,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {!isOpen && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
          style={{ backgroundColor: "#007D84", boxShadow: "var(--shadow-lg)" }}
          aria-label="Open chat"
        >
          <Activity className="h-8 w-8 text-white" strokeWidth={2.5} />
        </button>
      )}

      {/* Minimized Bar */}
      {isOpen && isMinimized && (
        <div
          className="fixed bottom-6 right-6 z-50 flex h-[60px] w-[260px] items-center gap-3 rounded-full pl-2 pr-4 shadow-lg animate-in slide-in-from-bottom-4 fade-in cursor-pointer hover:shadow-xl transition-shadow"
          style={{ backgroundColor: "#007D84" }}
          onClick={() => setIsMinimized(false)}
        >
          <div className="flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-white">
            <img src={chatbotIcon} alt="Chatbot" className="h-10 w-10" />
          </div>
          <span className="text-sm font-semibold text-white flex-1">Information Navigator</span>
          <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="text-white"
            >
              <polyline points="18 15 12 9 6 15"></polyline>
            </svg>
          </div>
        </div>
      )}

      {/* Chat Window */}
      {isOpen && !isMinimized && (
        <div
          className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-2xl bg-card shadow-2xl animate-in slide-in-from-bottom-4 fade-in"
          style={{
            boxShadow: "var(--shadow-lg)",
            backgroundColor: "hsl(var(--background))",
            colorScheme: "light",
          }}
        >
          {/* Header */}
          <div
            className="flex items-center justify-between px-6 py-4"
            style={{ backgroundColor: "#007D84", color: "#FFFFFF" }}
          >
            <div className="flex items-center gap-3">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
                <Activity className="h-7 w-7" style={{ color: "#007D84" }} strokeWidth={2.5} />
              </div>
              <div>
                <h3 className="text-lg font-bold">Information Navigator</h3>
                <p className="text-xs font-normal opacity-90">Your Helpful Navigator</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsMinimized(true)}
                className="h-8 w-8 rounded-full hover:bg-white/20"
                style={{ color: "#FFFFFF" }}
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={handleClose}
                className="h-8 w-8 rounded-full hover:bg-white/20"
                style={{ color: "#FFFFFF" }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 p-4" style={{ backgroundColor: "#E2E9EB" }}>
            <div className="space-y-2.5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${
                    message.isBot ? "justify-start" : "justify-end"
                  } animate-in fade-in slide-in-from-bottom-2`}
                >
                  {/* 🟢 EDITED: Increased margin-left to ml-8 to make room for the avatar */}
                  <div className={`${message.isBot ? "relative ml-0" : ""}`}>
                    
                    {/* 👇 EDITED BOT ICON SECTION (Circular & Repositioned) 👇 */}
                    {message.isBot && (
                      <div
                        className="absolute left-0 flex h-6 w-6 items-center justify-center bg-white rounded-full shadow-md z-10"
                        style={{
                            // Simplified positioning
                            left: 0,
                            marginTop: "0px", // Slight vertical adjustment
                        }}
                      >
                        <img
                          src={botMessageIcon}
                          alt="Chatbot"
                          className="h-6 w-6 rounded-full" // This makes the image circular
                          style={{
                            objectFit: "contain",
                          }}
                        />
                      </div>
                    )}
                    {/* 👆 END OF EDITED BOT ICON SECTION 👆 */}

                    <div
                      className="max-w-[85%] rounded-xl px-4 py-3"
                      style={{
                        backgroundColor: message.isBot ? "#007D84" : "#F0F0F0",
                        color: message.isBot ? "#FFFFFF" : "#333333",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        borderRadius: "12px",
                        marginLeft: message.isBot ? "10px" : "0",
                      }}
                    >
                      <p className="text-sm font-normal leading-relaxed break-words whitespace-pre-wrap">{message.text}</p>
                      <span
                        className={`mt-1 block text-xs font-normal ${
                          message.isBot ? "opacity-80" : "opacity-60"
                        }`}
                      >
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>

                      {/* Sources Section */}
                      {message.isBot &&
                        (message.intLinks?.length > 0 ||
                          message.extLinks?.length > 0) && (
                          <Sources
                            intLinks={message.intLinks}
                            extLinks={message.extLinks}
                          />
                        )}
                    </div>
                  </div>
                </div>
              ))}

              {/* 👇 EDITED LOADING ICON SECTION (Circular & Repositioned) 👇 */}
              {isLoading && (
                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                  <div className="relative ml-0"> 
                    <div
                        className="absolute left-0 flex h-6 w-6 items-center justify-center bg-white rounded-full shadow-md z-10"
                        style={{
                            left: 0,
                            marginTop: "0px",
                        }}
                      >
                        <img
                            src={botMessageIcon}
                            alt="Bot"
                            className="h-6 w-6 rounded-full"
                            style={{ objectFit: "contain" }}
                        />
                    </div>
                    <div
                      className="max-w-[80%] rounded-xl px-4 py-3"
                      style={{
                        backgroundColor: "#007D84",
                        color: "#FFFFFF",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        borderRadius: "12px",
                        marginLeft: "20px",
                      }}
                    >
                      <p className="text-sm font-normal leading-relaxed break-words whitespace-pre-wrap">
                        <span className="inline-flex gap-1">
                          <span className="animate-bounce" style={{ animationDelay: "0ms" }}>
                            .
                          </span>
                          <span className="animate-bounce" style={{ animationDelay: "150ms" }}>
                            .
                          </span>
                          <span className="animate-bounce" style={{ animationDelay: "300ms" }}>
                            .
                          </span>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
              {/* 👆 END OF EDITED LOADING ICON SECTION 👆 */}
              
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t bg-background p-4">
            <div className="flex gap-2 items-end">
              <Textarea
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyDown={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 rounded-2xl border-border bg-gray-200 px-4 py-3 min-h-[44px] max-h-[120px] resize-none"
                style={{ backgroundColor: "#E2E9EB" }}
                rows={1}
              />
              <Button
                onClick={handleSend}
                size="icon"
                disabled={isLoading}
                className="h-10 w-10 rounded-full disabled:opacity-50 flex-shrink-0"
                style={{ backgroundColor: "#007D84", color: "#FFFFFF" }}
              >
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};