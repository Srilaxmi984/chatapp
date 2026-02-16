import { useState, useRef } from "react";
import { SendHorizontal, Paperclip } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { useSendMessage } from "@/hooks/use-messages";
import { useAuth } from "@/hooks/use-auth";

export function MessageInput() {
  const [content, setContent] = useState("");
  const { mutate: sendMessage, isPending } = useSendMessage();
  const { user } = useAuth();
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!content.trim() || !user || isPending) return;

    sendMessage(
      { content: content.trim(), senderId: user.id },
      {
        onSuccess: () => {
          setContent("");
          if (textareaRef.current) {
            textareaRef.current.style.height = 'auto';
            textareaRef.current.focus();
          }
        },
      }
    );
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="p-4 md:p-6 bg-background/80 backdrop-blur-lg border-t border-border z-10">
      <div className="flex items-end gap-3 max-w-4xl mx-auto">
        <Button 
          variant="outline" 
          size="icon" 
          className="rounded-xl shrink-0 text-muted-foreground hover:text-foreground"
          disabled
        >
          <Paperclip className="w-5 h-5" />
        </Button>
        
        <div className="flex-1 relative bg-secondary/50 rounded-2xl border border-transparent focus-within:border-primary/30 focus-within:bg-background transition-all">
          <Textarea
            ref={textareaRef}
            value={content}
            onChange={(e) => setContent(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a message..."
            className="min-h-[50px] max-h-[200px] w-full resize-none bg-transparent border-0 focus-visible:ring-0 p-3.5"
            rows={1}
            disabled={isPending}
          />
        </div>

        <Button
          onClick={() => handleSubmit()}
          disabled={!content.trim() || isPending}
          size="icon"
          className={`
            rounded-xl h-[50px] w-[50px] shrink-0 transition-all duration-300
            ${content.trim() 
              ? "bg-primary text-primary-foreground shadow-lg shadow-primary/25 hover:scale-105" 
              : "bg-secondary text-muted-foreground hover:bg-secondary/80"
            }
          `}
        >
          <SendHorizontal className={`w-5 h-5 ${isPending ? "animate-pulse" : ""}`} />
        </Button>
      </div>
      <div className="text-center mt-2">
        <span className="text-[10px] text-muted-foreground">
          Press <strong>Enter</strong> to send
        </span>
      </div>
    </div>
  );
}
