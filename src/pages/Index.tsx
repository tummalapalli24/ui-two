import { ChatBot } from "@/components/ChatBot";

const Index = () => {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-medical-light to-background">
      <div className="text-center px-4">
        <div className="mb-8 flex justify-center">
          <div className="flex h-20 w-20 items-center justify-center rounded-full bg-primary text-5xl shadow-lg">
            👨‍⚕️
          </div>
        </div>
        <h1 className="mb-4 text-5xl font-bold text-foreground">
          Welcome to canHeal
        </h1>
        <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
          Your trusted virtual health assistant. Click the floating chat button to start a conversation.
        </p>
        <div className="mt-8 flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="text-primary">✓</span> 24/7 Availability
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary">✓</span> Professional Guidance
          </div>
          <div className="flex items-center gap-2">
            <span className="text-primary">✓</span> Instant Responses
          </div>
        </div>
      </div>
      <ChatBot />
    </div>
  );
};

export default Index;
