import { Card, CardContent } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background p-4">
      <Card className="w-full max-w-md border-border shadow-lg shadow-black/5">
        <CardContent className="pt-6 text-center">
          <div className="mb-6 flex justify-center">
            <div className="p-4 rounded-full bg-destructive/10 text-destructive">
              <AlertCircle className="h-12 w-12" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground font-display mb-2">404 Page Not Found</h1>
          <p className="text-muted-foreground mb-8">
            We couldn't find the page you were looking for. It might have been moved or deleted.
          </p>

          <Link href="/">
            <Button className="w-full py-6 text-base rounded-xl font-semibold">
              Return Home
            </Button>
          </Link>
        </CardContent>
      </Card>
    </div>
  );
}
