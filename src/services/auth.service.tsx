import type { Session, User } from "@supabase/supabase-js";
import { supabase } from "../libs/supabaseClient";


export async function signIn(email: string, password: string): Promise<{ user: User; session: Session }> { //visto che è sync ritorna sempre type Promise
  const { data, error } = await supabase.auth.signInWithPassword({ email, password});
    //data contiene user and session
  if (error || !data.user || !data.session) throw error ?? new Error("Login failed");  //if error è null/undefined, allo usa X.
  return { user: data.user, session: data.session };
}


export async function signUp(email: string, password: string, redirectTo?: string): Promise<{  //redirectTo is optional, //visto che è sync ritorna sempre type Promise
  user: User | null;
  session: Session | null;
  needsEmailVerification: boolean;
}> {
  const { data, error } = await supabase.auth.signUp(  //supabase ti ritornerà obj, al cui interno estrai solo data & error 
    redirectTo ? 
      { email, password, options: { emailRedirectTo: redirectTo } } :  //emailRedirectTo per reinderizzare in auto utente su url target(e.g. https://myapp.com/auth/callback) appena schiccia il link sulla email di conferma
      { email, password }
  );
  if (error) throw error;
  return {  
    user: data.user ?? null,  //se data.user is null/undefined, allora usa null
    session: data.session ?? null,
    needsEmailVerification: !data.session, //se non c'è session, allora needsEmailVerification=true e quindi serve conferma email
  };
}//può essere null e anche session di solito è null finche l'utente non conferma tramite email


export async function signOut(): Promise<void> {  //visto che è sync ritorna sempre type Promise
  const { error } = await supabase.auth.signOut();  //invalida la sessione locale server + chiude sessione server
  if (error) throw error;
}
