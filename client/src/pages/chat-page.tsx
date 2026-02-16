import { ChatLayout } from "@/components/chat-layout";
import { MessageList } from "@/components/message-list";
import { MessageInput } from "@/components/message-input";
import { useMessages, useChatWebSocket } from "@/hooks/use-messages";
import { Loader2 } from "lucide-react";

export default function ChatPage() {
  const { data: messages, isLoading, error } = useMessages();
  
  // Initialize WebSocket connection
  useChatWebSocket();

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-background">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-8 h-8 animate-spin text-primary" />
          <p className="text-muted-foreground font-medium animate-pulse">Loading conversation...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex h-screen items-center justify-center bg-background p-4">
        <div className="text-center max-w-md bg-destructive/5 p-8 rounded-3xl border border-destructive/20">
          <h2 className="text-xl font-bold text-destructive mb-2">Something went wrong</h2>
          <p className="text-muted-foreground mb-4">{(error as Error).message}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-background border border-border rounded-lg text-sm hover:bg-secondary transition-colors"
          >
            Reload Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <ChatLayout>
      <MessageList messages={messages || []} />
      <MessageInput />
    </ChatLayout>
  );
}
