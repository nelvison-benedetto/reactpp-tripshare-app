import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../libs/supabaseClient";
import type { UserDBFormat } from "../../../types/user";


//serve solo per creare query cache + fare SELECT avendo un id, su tabella 'users' e ottenere tutti i dati del target user + popolare cache con i results
//dopodiche in realta useUserProfile rimane sempre in ascolto su quella query-cache.
//se useRealtimeUserProfile grazie a setQueryData() sovrascrive i dati su questa query-cache, react-query avverte useUserProfile e Reactjs rifa il rendering!

//dunque usi useUserProfile + useRealtimeUserProfile, dentro un comp per ottenere l'user X dal db & attivare aggiornamenti realtime legati a user X  
  //e.g. li puoi usare dentro comp UserProfile ed a entrambi passi lo stesso userId

export function useUserProfile(userId?: string | null) {   //questo lo utilizzi solo per i SELECT su tabella users

  return useQuery<UserDBFormat | null, Error>({  //crei voce univoca nella cache di React Query

    queryKey: ["user-profile", userId],  //!!array che identifica in modo univoco i dati in cache. e.g ["xxx",1] sarà in cache diversa di ["xxx",2], ovviamente anche l'ordine all'interno di [] è importante x distinguerle
    enabled: Boolean(userId),  //evita che la query parte (queryFn) quando userId è false (convertito a false se era undefined/null/falsy)
    queryFn: async ({ queryKey }) => {  //funct che effetua la fetch
      const id = queryKey[1] as string;
      const { data, error } = await supabase
        .from("users")  //attivo gia tipizzazione (cosi evito a riga 18 di usare return data as UserDBFormat)
        .select("id, username, full_name, avatar_url, bio, created_at, updated_at")  //selezioni le colonne
        .eq("id", id)  //filtra
        .single();  //ci aspettimo esattamente 1 record. se supabase non lo trova/ne trova multipli allora error
          //oppure al posto di single() usare maybeSingle() che non lancia errore ma return data=null
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60, //freshness dei dati= 1minuto
    retry: 1,  //se fa errore ritenta al massimo ancora 1 volta

  });

}
