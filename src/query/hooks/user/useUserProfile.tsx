import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../libs/supabaseClient";
import type { UserDBFormat } from "../../../types/user";

export function useUserProfile(userId?: string | null) {

  return useQuery<UserDBFormat | null, Error>({  //crei voce univoca nella cache di React Query
    queryKey: ["user-profile", userId],  //chiave univoca della cache
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
