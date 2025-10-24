import { useState, useRef, useEffect } from "react";
import { Send, X, Minimize2, Activity } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCommentDots } from "@fortawesome/free-regular-svg-icons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: Date;
}

export const ChatBot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm Information Navigator, your virtual assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date(),
    },
  ]);
  const [inputValue, setInputValue] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const { toast } = useToast();

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
      // ✅ Call backend with GET request instead of POST
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
    if (e.key === "Enter") {
      handleSend();
    }
  };

  return (
    <>
      {/* Floating Chat Button */}
      {(!isOpen || isMinimized) && (
        <button
          onClick={() => {
            setIsOpen(true);
            setIsMinimized(false);
          }}
          className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
          style={{ backgroundColor: "#007D84", boxShadow: "var(--shadow-lg)" }}
          aria-label="Open chat"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <FontAwesomeIcon icon={faCommentDots} className="h-6 w-6" style={{ color: "#007D84" }} />
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && !isMinimized && (
        <div
          className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-2xl bg-card shadow-2xl animate-in slide-in-from-bottom-4 fade-in"
          style={{ 
            boxShadow: "var(--shadow-lg)",
            backgroundColor: "hsl(var(--background))",
            colorScheme: "light"
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4" style={{ backgroundColor: "#007D84", color: "#FFFFFF" }}>
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <FontAwesomeIcon icon={faCommentDots} className="h-5 w-5" style={{ color: "#007D84" }} />
              </div>
              <div>
                <h3 className="text-lg font-semibold">Information Navigator</h3>
                <p className="text-xs opacity-90">Your Information Navigator</p>
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
                onClick={() => setIsOpen(false)}
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
                  className={`flex ${message.isBot ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-2`}
                >
                  <div className={`${message.isBot ? "relative ml-3" : ""}`}>
                    {message.isBot && (
                      <div className="absolute -left-3 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-white" style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                        <FontAwesomeIcon icon={faCommentDots} className="h-4 w-4" style={{ color: "#007D84" }} />
                      </div>
                    )}
                    <div
                      className={`${message.isBot ? "max-w-[85%]" : "max-w-[85%]"} rounded-xl px-4 py-3`}
                      style={{
                        backgroundColor: message.isBot ? "#007D84" : "#F0F0F0",
                        color: message.isBot ? "#FFFFFF" : "#333333",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        borderRadius: "12px",
                      }}
                    >
                      <p className="text-sm font-normal leading-relaxed">{message.text}</p>
                      <span className={`mt-1 block text-xs font-normal ${message.isBot ? "opacity-80" : "opacity-60"}`}>
                        {message.timestamp.toLocaleTimeString([], {
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                  <div className="relative ml-3">
                    <div className="absolute -left-3 top-0 flex h-6 w-6 items-center justify-center rounded-full bg-white" style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
                      <FontAwesomeIcon icon={faCommentDots} className="h-4 w-4" style={{ color: "#007D84" }} />
                    </div>
                    <div 
                      className="max-w-[80%] rounded-xl px-4 py-3"
                      style={{ 
                        backgroundColor: "#007D84",
                        color: "#FFFFFF",
                        boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                        borderRadius: "12px"
                      }}
                    >
                      <p className="text-sm font-normal leading-relaxed">
                        <span className="inline-flex gap-1">
                          <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                          <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                          <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
          </ScrollArea>

          {/* Input */}
          <div className="border-t bg-background p-4">
            <div className="flex gap-2">
              <Input
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder="Type your message..."
                className="flex-1 rounded-full border-border bg-gray-200 px-4"
                style={{ backgroundColor: "#E2E9EB" }}
              />
              <Button
                onClick={handleSend}
                size="icon"
                disabled={isLoading}
                className="h-10 w-10 rounded-full disabled:opacity-50"
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
