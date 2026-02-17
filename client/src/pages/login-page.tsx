import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { MessageSquare, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

export default function LoginPage() {
  const { user, isLoading } = useAuth();
  const { toast } = useToast();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  if (isLoading) return null;

  if (user) {
    window.location.href = "/";
    return null;
  }

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
        credentials: "include",
      });

      if (res.ok) {
        window.location.href = "/";
      } else {
        const text = await res.text();
        toast({
          title: "Login Failed",
          description: text,
          variant: "destructive"
        });
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "Connection failed",
        variant: "destructive"
      });
    } finally {
      setIsLoggingIn(false);
    }
  };

  const handleRegister = async () => {
    setIsLoggingIn(true);
    try {
      console.log("Attempting registration...");
      const res = await fetch("/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password, firstName: username, lastName: "", profileImageUrl: "" }),
        credentials: "include",
      });

      console.log("Registration response status:", res.status);

      if (res.ok) {
        toast({
          title: "Registered successfully",
          description: "Account created. Logging in...",
        });
        // Registration already sets the cookie, so we can just reload/redirect
        window.location.href = "/";
      } else {
        const text = await res.text();
        console.error("Registration failed:", text);
        toast({
          title: "Registration Failed",
          description: text || "Unknown error occurred",
          variant: "destructive"
        });
        setIsLoggingIn(false);
      }
    } catch (error) {
      console.error("Registration error:", error);
      toast({
        title: "Connection Error",
        description: "Could not connect to server. Please check if backend is running.",
        variant: "destructive"
      });
      setIsLoggingIn(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex bg-background">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex w-1/2 bg-zinc-900 relative overflow-hidden flex-col justify-between p-12">
        {/* Abstract Background Shapes */}
        <div className="absolute top-0 left-0 w-full h-full opacity-20">
          <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] rounded-full bg-primary blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-10%] w-[600px] h-[600px] rounded-full bg-blue-600 blur-[120px]" />
        </div>

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-8">
            <div className="p-2.5 bg-white/10 rounded-xl backdrop-blur-md border border-white/10">
              <MessageSquare className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold font-display text-white tracking-wide">NebulaChat</span>
          </div>
        </div>

        <div className="relative z-10 max-w-lg">
          <h1 className="text-5xl font-bold font-display text-white leading-[1.1] mb-6">
            Connect with your team in real-time.
          </h1>
          <p className="text-lg text-zinc-400 leading-relaxed">
            Experience seamless communication with a modern interface designed for productivity and clarity.
            Secure, fast, and beautiful.
          </p>
        </div>

        <div className="relative z-10 flex items-center gap-2 text-sm text-zinc-500 font-medium">
          <Sparkles className="w-4 h-4 text-primary" />
          <span>Powered by Quarkus & SQLite</span>
        </div>
      </div>

      {/* Right Panel - Login */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-2xl font-bold tracking-tight mb-2 font-display">Welcome Back</h2>
            <p className="text-muted-foreground">Sign in to your account to continue</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <div className="bg-card border border-border/50 shadow-xl shadow-black/5 rounded-2xl p-8">
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input id="username" value={username} onChange={e => setUsername(e.target.value)} required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input id="password" type="password" value={password} onChange={e => setPassword(e.target.value)} required />
                </div>

                <div className="flex gap-4 pt-4">
                  <Button
                    type="submit"
                    disabled={isLoggingIn}
                    className="flex-1 py-6 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200"
                  >
                    {isLoggingIn ? "Loading..." : "Log in"}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleRegister}
                    disabled={isLoggingIn}
                    className="flex-1 py-6 text-base font-semibold rounded-xl hover:-translate-y-0.5 transition-all duration-200"
                  >
                    Register
                  </Button>
                </div>
              </form>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
