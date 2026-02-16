import { ReactNode } from "react";
import { useAuth } from "@/hooks/use-auth";
import { useUsers } from "@/hooks/use-users";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { LogOut, Users, MessageSquare } from "lucide-react";
import { motion } from "framer-motion";

interface ChatLayoutProps {
  children: ReactNode;
}

export function ChatLayout({ children }: ChatLayoutProps) {
  const { user, logout } = useAuth();
  const { data: users, isLoading: usersLoading } = useUsers();

  const otherUsers = users?.filter((u) => u.id !== user?.id) || [];

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <motion.aside 
        initial={{ x: -100, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        className="w-80 border-r border-border bg-card/50 hidden md:flex flex-col"
      >
        <div className="p-6 border-b border-border/50">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-primary/10 rounded-xl text-primary">
              <MessageSquare className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-bold font-display bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              NebulaChat
            </h1>
          </div>

          {user && (
            <div className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
              <Avatar className="h-10 w-10 border-2 border-background ring-2 ring-primary/20">
                <AvatarImage src={user.profileImageUrl || undefined} />
                <AvatarFallback className="bg-primary/10 text-primary font-bold">
                  {user.firstName?.[0]}{user.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold truncate">
                  {user.firstName} {user.lastName}
                </p>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
                  Online
                </p>
              </div>
            </div>
          )}
        </div>

        <ScrollArea className="flex-1 px-4 py-4">
          <div className="mb-4 px-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
            Online Users ({otherUsers.length})
          </div>
          
          <div className="space-y-1">
            {usersLoading ? (
              Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="flex items-center gap-3 p-2 rounded-lg animate-pulse">
                  <div className="w-8 h-8 rounded-full bg-muted" />
                  <div className="h-4 w-24 bg-muted rounded" />
                </div>
              ))
            ) : otherUsers.length > 0 ? (
              otherUsers.map((u) => (
                <div
                  key={u.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-secondary/80 transition-colors cursor-pointer group"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={u.profileImageUrl || undefined} />
                    <AvatarFallback>{u.firstName?.[0]}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium text-foreground/80 group-hover:text-foreground">
                    {u.firstName} {u.lastName}
                  </span>
                </div>
              ))
            ) : (
              <div className="text-sm text-muted-foreground p-4 text-center">
                No other users online
              </div>
            )}
          </div>
        </ScrollArea>

        <div className="p-4 border-t border-border/50">
          <Button 
            variant="ghost" 
            className="w-full justify-start text-muted-foreground hover:text-destructive hover:bg-destructive/10"
            onClick={() => logout()}
          >
            <LogOut className="w-4 h-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col relative bg-background/50 backdrop-blur-xl">
        {/* Mobile Header */}
        <div className="md:hidden flex items-center justify-between p-4 border-b border-border bg-background/80 backdrop-blur-md sticky top-0 z-10">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-primary" />
            <h1 className="font-bold font-display">NebulaChat</h1>
          </div>
          <Button variant="ghost" size="icon" onClick={() => logout()}>
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
        
        {children}
      </main>
    </div>
  );
}
