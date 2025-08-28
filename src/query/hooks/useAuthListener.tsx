import { useEffect } from "react";
import { supabase } from "../../libs/supabaseClient";
import { useAppDispatch } from "../../store/hooks"; 
import { setUser, logout } from "../../store/slices/authSlice";
import type { Session } from "@supabase/supabase-js";

//supabase gestisce la sessione dell’utente (login, logout, token refresh, email verification),
//redux tiene lo stato globale dell’utente nella tua app React,
//questo hook FA DA PONTE, TENENDO SINCRONIZZATO AUTH supabase-redux, centrallizzi evitando cosi anche di fare auth in ogni comp separatamente
//DEVE ESSERE MONTATO 1 SOLA VOLTA, add  'useAuthListener();'  in app.tsx

export function useAuthListener() {
  const dispatch = useAppDispatch();  //useAppDispatch è la versione tipazzata security w TS di useDispatch, more in store/hooks.tsx

  useEffect(() => {
    type SubscriptionLike = { unsubscribe?: () => void };
    let subscriptionRef: SubscriptionLike | null = null;  //è di type SubscriptionLike or null.
      //xk api di supabase nel tempo è un po cambiata, alcune versioni ritorna { data: { subscription } } mentre in altre subscription w unsubscribe

    //1- quando il comp si monta, vuoi sapere immediatamente chi si è loggato, e dopo aggiorni redux
    ( async () => {
      try {
        const { data } = await supabase.auth.getUser();
        dispatch(setUser(data.user ?? null));  //dispatch(cioe useAppDispatch custom) è l'unico modo x aggiornare lo stato setUser
          //aggiorni l'user
      } catch (err) {
        console.error('getUser failed', err);
        dispatch(logout());  //logout
      }
    } )();

    //2- registra il listener su eventi di auth gestiti da supabase
    //supabase ti chiama ogni vlta che cambia sessione, qualsiasi login, logout o cambio di token viene riflesso subito nello store globale
    const res = supabase.auth.onAuthStateChange(
    //const { data: { subscription } } = supabase.auth.onAuthStateChange(  //onAuthStateChange return an obj that contains data.subscription che ti serve nel cleanup
      ( _event, session: Session | null) => {  //event è il tipo di evento(here non ti serve, lo prefiggi con '_')
        if (session?.user) {  //equivalente di if(session && session.user) dove controlla per prima session 
          dispatch(setUser(session.user));
        } else {
          dispatch(logout());
        }
      }
    );

    // estrai subscription in modo difensivo (compatibilità con variazioni di supabase api)
    //Se res.data.subscription esiste, usalo. Altrimenti, usa res direttamente
    if ("data" in res && res.data && "subscription" in res.data) {
      subscriptionRef = res.data.subscription as SubscriptionLike;
    } else {
      subscriptionRef = res as SubscriptionLike;
    }

    //3- cleanup, rimuove il listener quando si smonta il componente, liberando memory!!
    return () => {
      try {
        subscriptionRef?.unsubscribe?.();
      } catch (e) {
        console.warn('Failed to unsubscribe auth listener', e);
      }
    };
  }, [dispatch]);  //dispatch non cambia mai durante il ciclo di vita dell'app, tutto questo code viene eseguito 1 volta 
  //al montaggio di App.tsx, e poi si attivera sempre e solo   const res = supabase.auth.onAuthStateChange(...)
  //perche Supabase la attiva quando cambia la sessione(anche se utente non fa assolutamente nulla) !!

}
