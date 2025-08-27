import { useEffect } from "react";
import { supabase } from "../../../libs/supabaseClient";
import { useQueryClient } from "@tanstack/react-query";
import type {UserDBFormat} from "../../../types/user"

//ponte realtime tra Supabase e React Query: iscrive il client agli eventi realtime di Postgres, 
//cosi ppena cambia la riga users di quell’utente aggiorna SUBITO la cache React Query target, no bisogno di refetch a comando.

export function useRealtimeUserProfile(userId?: string | null) {
  const qc = useQueryClient();

  useEffect(() => {  //si esegue 1 volta quando si monta il componente, cio basta x accendere il Canale, poi l'unico modo per chiuderlo è se this useRealtimeUserProfile si smonta / useEffect si riesegue xk cambia userId  or qc 
    if (!userId) return;

    const channel = supabase
      .channel(`users:${userId}`)  //crei canale dedicato chiamato 'users:XXX'
      .on( 
        "postgres_changes",  //mandatory, nome del listener supabase a disposizione per ascoltare i cambiamenti sul DB Postgres
        {   event: "*",    //intercetta tutti gli eventi INSERT/UPDATE/DELETE
            schema: "public", 
            table: "users",   //ascolti la tab del db users
            filter: `id=eq.${userId}` //ti focalizzi solo su target record
        },  
        (payload) => {  //quindi, quando scatta un evento (che ti è arrivato perche ha passato il fitraggio qua sopra), 
          // supabse ti invia un payload (payload.new è proprio il record aggiornato)
          if (payload.eventType === "UPDATE" || payload.eventType === "INSERT") {
            const fresh = payload.new as UserDBFormat;
            qc.setQueryData(["user-profile", userId], fresh);  //sovrascrive la cache target con i dati freschi
          }
        }
      )
      .subscribe();  //attiva davvero il canale appena settato

    return() => {  //funzione di cleanup di React useEffect, si attiva quando il comp che usa this useRealtimeUserProfile si smonta / si riesegue xk cambia userId  or qc
      channel.unsubscribe();  //ti disconetti dal canale realtime
    };
  }, [userId, qc]);

}
