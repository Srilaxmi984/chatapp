import { useEffect, useRef } from "react";
import { format } from "date-fns";
import { useAuth } from "@/hooks/use-auth";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { motion, AnimatePresence } from "framer-motion";
import type { MessageWithSender } from "@shared/schema";

interface MessageListProps {
  messages: MessageWithSender[];
}

export function MessageList({ messages }: MessageListProps) {
  const { user } = useAuth();
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <ScrollArea className="flex-1 p-4 md:p-6 scrollbar-thin">
      <div className="flex flex-col gap-6 pb-4">
        {messages.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 text-center opacity-50">
            <div className="bg-secondary p-6 rounded-full mb-4">
              <span className="text-4xl">👋</span>
            </div>
            <h3 className="text-lg font-semibold">No messages yet</h3>
            <p className="text-muted-foreground">Be the first to say hello!</p>
          </div>
        )}

        <AnimatePresence initial={false}>
          {messages.map((message, index) => {
            const isMe = message.senderId === user?.id;
            const isSequential = index > 0 && messages[index - 1].senderId === message.senderId;

            return (
              <motion.div
                key={message.id}
                initial={{ opacity: 0, y: 20, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className={`flex gap-3 ${isMe ? "flex-row-reverse" : "flex-row"}`}
              >
                {!isMe && !isSequential && (
                  <Avatar className="w-8 h-8 mt-1 ring-2 ring-border/50">
                    <AvatarImage src={message.sender.profileImageUrl || undefined} />
                    <AvatarFallback className="bg-secondary text-xs">
                      {message.sender.firstName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                )}
                
                {/* Spacer for sequential messages alignment */}
                {!isMe && isSequential && <div className="w-8" />}

                <div className={`flex flex-col max-w-[80%] md:max-w-[60%] ${isMe ? "items-end" : "items-start"}`}>
                  {!isSequential && !isMe && (
                    <span className="text-xs font-medium text-muted-foreground mb-1 ml-1">
                      {message.sender.firstName}
                    </span>
                  )}
                  
                  <div
                    className={`
                      px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed break-words
                      ${isMe 
                        ? "bg-primary text-primary-foreground rounded-tr-sm" 
                        : "bg-card border border-border/50 text-foreground rounded-tl-sm"
                      }
                    `}
                  >
                    {message.content}
                  </div>
                  
                  <span className="text-[10px] text-muted-foreground mt-1 opacity-60 px-1">
                    {message.createdAt && format(new Date(message.createdAt), "p")}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
