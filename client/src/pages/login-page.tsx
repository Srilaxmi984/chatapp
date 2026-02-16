import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { MessageSquare, Sparkles } from "lucide-react";
import { motion } from "framer-motion";

export default function LoginPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) return null;

  if (user) {
    window.location.href = "/";
    return null;
  }

  const handleLogin = () => {
    window.location.href = "/api/login";
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
          <span>Powered by Replit & PostgreSQL</span>
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
              <div className="space-y-4">
                <Button
                  onClick={handleLogin}
                  className="w-full py-6 text-base font-semibold rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground shadow-lg shadow-primary/20 hover:shadow-primary/30 hover:-translate-y-0.5 transition-all duration-200"
                >
                  Log in with Replit
                </Button>
                
                <p className="text-center text-xs text-muted-foreground mt-6">
                  By clicking continue, you agree to our Terms of Service and Privacy Policy.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
