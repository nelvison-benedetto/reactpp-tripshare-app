// query/hooks/post/useRealtimePostsFeed.ts
import { useEffect } from "react";
import { supabase } from "../../../libs/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";

export function useRealtimePostsFeed() {
  const qc = useQueryClient();

  useEffect(() => {
    const channel = supabase
      .channel("posts:feed")
      .on(
        "postgres_changes",
        { 
            event: "*",
            schema: "public",
            table: "posts"
        }, () => {  //non mi serve ne utilizzo payload
        // strategia semplice e robusta: invalida il feed
        qc.invalidateQueries({ queryKey: ["posts", "feed"] });
      })
      .subscribe();

    return () => {channel.unsubscribe()};
  }, [qc]);
}
