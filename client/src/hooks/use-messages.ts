import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, type InsertMessage } from "@shared/routes";
import { useRef, useEffect } from "react";
import { useToast } from "@/hooks/use-toast";

export function useMessages() {
  const { toast } = useToast();
  
  return useQuery({
    queryKey: [api.messages.list.path],
    queryFn: async () => {
      const res = await fetch(api.messages.list.path, { credentials: "include" });
      if (!res.ok) throw new Error("Failed to fetch messages");
      return api.messages.list.responses[200].parse(await res.json());
    },
    // We'll rely on WebSocket for real-time updates mostly, 
    // but a slow poll ensures consistency
    refetchInterval: 10000, 
  });
}

export function useSendMessage() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (message: InsertMessage) => {
      const res = await fetch(api.messages.create.path, {
        method: api.messages.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(message),
        credentials: "include",
      });
      
      if (!res.ok) {
        if (res.status === 400) {
          const error = api.messages.create.responses[400].parse(await res.json());
          throw new Error(error.message);
        }
        throw new Error("Failed to send message");
      }
      
      return api.messages.create.responses[201].parse(await res.json());
    },
    onSuccess: (newMessage) => {
      // Optimistically update or wait for invalidation
      queryClient.setQueryData([api.messages.list.path], (oldData: any) => {
        if (!oldData) return [newMessage];
        return [...oldData, newMessage];
      });
    },
    onError: (error) => {
      toast({
        title: "Error sending message",
        description: error.message,
        variant: "destructive",
      });
    },
  });
}

export function useChatWebSocket() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  const wsRef = useRef<WebSocket | null>(null);

  useEffect(() => {
    const protocol = window.location.protocol === "https:" ? "wss:" : "ws:";
    const wsUrl = `${protocol}//${window.location.host}/ws`;
    
    const connect = () => {
      const ws = new WebSocket(wsUrl);
      wsRef.current = ws;

      ws.onopen = () => {
        console.log("Connected to Chat WS");
      };

      ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'message') {
            const message = data.payload;
            queryClient.setQueryData([api.messages.list.path], (oldData: any) => {
              // Avoid duplicates if we just sent it
              if (!oldData) return [message];
              if (oldData.some((m: any) => m.id === message.id)) return oldData;
              return [...oldData, message];
            });
          }
        } catch (e) {
          console.error("Failed to parse WS message", e);
        }
      };

      ws.onerror = (error) => {
        console.error("WS Error", error);
      };

      ws.onclose = () => {
        console.log("WS Closed, reconnecting...");
        setTimeout(connect, 3000);
      };
    };

    connect();

    return () => {
      wsRef.current?.close();
    };
  }, [queryClient]);

  return wsRef.current;
}
