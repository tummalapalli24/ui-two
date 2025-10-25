import { useState } from "react";
import { ChevronDown, ExternalLink, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

interface Source {
  title: string;
  url: string;
}

interface SourcesProps {
  messageId: string;
}

export const Sources = ({ messageId }: SourcesProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const { toast } = useToast();

  const fetchSources = async () => {
    if (hasLoaded) return;
    
    setIsLoading(true);
    try {
      const response = await fetch(
        `http://52.54.56.23:7860/api/sources?messageId=${encodeURIComponent(messageId)}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch sources");
      }

      const data = await response.json();
      setSources(data.sources || []);
      setHasLoaded(true);
    } catch (error) {
      console.error("Error fetching sources:", error);
      toast({
        title: "Error",
        description: "Could not load sources",
        variant: "destructive",
      });
      setSources([]);
      setHasLoaded(true);
    } finally {
      setIsLoading(false);
    }
  };

  const toggleExpanded = async () => {
    if (!isExpanded && !hasLoaded) {
      await fetchSources();
    }
    setIsExpanded(!isExpanded);
  };

  return (
    <div className="mt-2">
      <button
        onClick={toggleExpanded}
        className="flex items-center gap-2 text-xs font-normal transition-colors hover:opacity-80"
        style={{ color: "#007D84" }}
      >
        <motion.div
          animate={{ rotate: isExpanded ? 180 : 0 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronDown className="h-3 w-3" />
        </motion.div>
        <span>{isExpanded ? "Hide related sources" : "View related sources"}</span>
      </button>

      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
            className="overflow-hidden"
          >
            <div className="mt-2 space-y-2">
              {isLoading && (
                <div className="flex items-center gap-2 text-xs" style={{ color: "#007D84" }}>
                  <Loader2 className="h-3 w-3 animate-spin" />
                  <span className="font-normal">Loading sources...</span>
                </div>
              )}

              {!isLoading && sources.length === 0 && hasLoaded && (
                <p className="text-xs font-normal opacity-70">No sources available</p>
              )}

              {!isLoading && sources.length > 0 && (
                <div className="space-y-1.5">
                  {sources.map((source, index) => (
                    <a
                      key={index}
                      href={source.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start gap-2 rounded-lg px-3 py-2 text-xs font-normal transition-colors hover:bg-white/10"
                      style={{ backgroundColor: "rgba(255, 255, 255, 0.05)" }}
                    >
                      <span className="flex-1 leading-relaxed">{source.title}</span>
                      <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-70" />
                    </a>
                  ))}
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
