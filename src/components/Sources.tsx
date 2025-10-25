import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface SourcesProps {
  intLinks?: string[];
  extLinks?: string[];
}

export const Sources = ({ intLinks = [], extLinks = [] }: SourcesProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const hasAnyLinks = intLinks.length > 0 || extLinks.length > 0;

  if (!hasAnyLinks) return null;

  const toggleExpanded = () => setIsExpanded(!isExpanded);

  return (
    <div className="mt-2">
      <button
        onClick={toggleExpanded}
        className="flex items-center gap-2 text-xs font-normal transition-colors hover:opacity-80"
        style={{ color: "#FFFFFF" }}
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
            <div className="mt-2 space-y-3">
              {intLinks.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-white/80 mb-1">
                    📁 Internal Links
                  </h4>
                  <div className="space-y-1.5">
                    {intLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 rounded-lg px-3 py-2 text-xs font-normal transition-colors hover:bg-white/20"
                        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                      >
                        <span className="flex-1 leading-relaxed break-all">{link}</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-70" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {extLinks.length > 0 && (
                <div>
                  <h4 className="text-xs font-semibold text-white/80 mb-1">
                    🌐 External Sources
                  </h4>
                  <div className="space-y-1.5">
                    {extLinks.map((link, i) => (
                      <a
                        key={i}
                        href={link}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-2 rounded-lg px-3 py-2 text-xs font-normal transition-colors hover:bg-white/20"
                        style={{ backgroundColor: "rgba(255,255,255,0.1)" }}
                      >
                        <span className="flex-1 leading-relaxed break-all">{link}</span>
                        <ExternalLink className="h-3 w-3 flex-shrink-0 opacity-70" />
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
