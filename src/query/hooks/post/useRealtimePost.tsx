import { useEffect } from "react";
import { supabase } from "../../../libs/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import type { PostDBFormat } from "../../../types/db";

export function useRealtimePost(postId?: string | null) {
  const qc = useQueryClient();

  useEffect(() => {
    if (!postId) return;

    const channel = supabase
      .channel(`posts:${postId}`)
      .on(
        "postgres_changes",
        { 
            event: "*", 
            schema: "public", 
            table: "posts", 
            filter: `id=eq.${postId}` 
        },
        (payload) => {
          if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
            const fresh = payload.new as PostDBFormat;
            qc.setQueryData(["post", postId], fresh);
          }
          if (payload.eventType === "DELETE") {
            qc.removeQueries({ queryKey: ["post", postId] });
          }
        }
      )
      .subscribe();

    return () => {
      channel.unsubscribe();
    };
  }, [postId, qc]);
}