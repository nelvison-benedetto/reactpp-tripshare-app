// query/hooks/post/useRealtimePostsFeed.ts
import { useEffect } from "react";
import { supabase } from "../../../libs/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";

//in pratica ogni volta che cattura un evento su tab 'posts', invalida la cache-query CHE INIZIA CON ["posts", "feed"]
export function useRealtimePostsFeed() {
  const qc = useQueryClient();

  useEffect(() => {  //si esegue 1 volta quando si monta il componente, cio basta x accendere il Canale, poi l'unico modo per chiuderlo è se this useRealtimeUserProfile si smonta / useEffect si riesegue xk cambia userId  or qc 
    const channel = supabase
      .channel("posts:feed")  //crei canale dedicato chiamato 'users:XXX'
      .on(
        "postgres_changes",
        { 
            event: "*",  //intercetta tutti gli eventi INSERT/UPDATE/DELETE
            schema: "public",
            table: "posts"  //ascolti la tab del db posts
        }, () => {  //non mi serve ne utilizzo payload
        qc.invalidateQueries({ queryKey: ["posts", "feed"] });  
          //"La/e query con chiave CHE INIZIA CON ["posts", "feed"] (le hai create in usePostsFeed), rifetchala la prossima volta che serve" 
      })
      .subscribe();  //attiva davvero il canale appena settato

    return () => {  //funzione di cleanup di React useEffect, si attiva quando il comp che usa this useRealtimeUserProfile si smonta / si riesegue xk cambia userId  or qc
      channel.unsubscribe()  //ti disconetti dal canale realtime
    };
  }, [qc]);
}

