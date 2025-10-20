import { useState, useRef, useEffect } from "react";
import { Send, X, Minimize2, Activity, Stethoscope } from "lucide-react";
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
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm canHeal, your virtual health assistant. How can I help you today?",
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
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-50 flex h-16 w-16 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-all duration-300 hover:scale-110 hover:shadow-xl"
          style={{ boxShadow: "var(--shadow-lg)" }}
          aria-label="Open chat"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white">
            <Activity className="h-6 w-6 text-green-500" />
          </div>
        </button>
      )}

      {/* Chat Window */}
      {isOpen && (
        <div
          className="fixed bottom-6 right-6 z-50 flex h-[600px] w-[400px] flex-col overflow-hidden rounded-2xl bg-card shadow-2xl animate-in slide-in-from-bottom-4 fade-in"
          style={{ 
            boxShadow: "var(--shadow-lg)",
            backgroundColor: "hsl(var(--background))",
            colorScheme: "light"
          }}
        >
          {/* Header */}
          <div className="flex items-center justify-between bg-primary px-6 py-4 text-primary-foreground">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white">
                <Activity className="h-5 w-5 text-green-500" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">canHeal</h3>
                <p className="text-xs opacity-90">Your Health Assistant</p>
              </div>
            </div>
            <div className="flex gap-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full text-primary-foreground hover:bg-white/20"
              >
                <Minimize2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 rounded-full text-primary-foreground hover:bg-white/20"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Messages */}
          <ScrollArea className="flex-1 bg-muted/30 p-4">
            <div className="space-y-2.5">
              {messages.map((message) => (
                <div
                  key={message.id}
                  className={`flex ${message.isBot ? "justify-start" : "justify-end"} animate-in fade-in slide-in-from-bottom-2`}
                >
                  <div
                    className={`${message.isBot ? "max-w-[85%]" : "max-w-[85%]"} rounded-xl px-4 py-3 ${
                      message.isBot
                        ? "relative pt-8"
                        : ""
                    }`}
                    style={{
                      backgroundColor: message.isBot ? "#436F79" : "#F0F0F0",
                      color: message.isBot ? "#FFFFFF" : "#333333",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                      borderRadius: "12px",
                    }}
                  >
                    {message.isBot && (
                      <div className="absolute top-[6px] left-[6px]">
                        <Stethoscope className="h-6 w-6 text-white" />
                      </div>
                    )}
                    <p className={`text-sm leading-relaxed ${message.isBot ? "pl-8" : ""}`}>{message.text}</p>
                    <span className={`mt-1 block text-xs ${message.isBot ? "pl-8 opacity-80" : "opacity-60"}`}>
                      {message.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                </div>
              ))}
              {isLoading && (
                <div className="flex justify-start animate-in fade-in slide-in-from-bottom-2">
                  <div 
                    className="max-w-[80%] rounded-xl px-4 py-3 relative pt-8"
                    style={{ 
                      backgroundColor: "#436F79",
                      color: "#FFFFFF",
                      boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                      borderRadius: "12px"
                    }}
                  >
                    <div className="absolute top-[6px] left-[6px]">
                      <Stethoscope className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-sm leading-relaxed pl-8">
                      <span className="inline-flex gap-1">
                        <span className="animate-bounce" style={{ animationDelay: "0ms" }}>.</span>
                        <span className="animate-bounce" style={{ animationDelay: "150ms" }}>.</span>
                        <span className="animate-bounce" style={{ animationDelay: "300ms" }}>.</span>
                      </span>
                    </p>
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
                className="flex-1 rounded-full border-border bg-gray-200 px-4 focus-visible:ring-primary"
              />
              <Button
                onClick={handleSend}
                size="icon"
                disabled={isLoading}
                className="h-10 w-10 rounded-full bg-primary hover:bg-secondary disabled:opacity-50"
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
