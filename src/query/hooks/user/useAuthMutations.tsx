import { useMutation, useQueryClient } from "@tanstack/react-query";
import { signIn, signUp, signOut } from "../../../services/auth.service";
import { useAppDispatch } from "../../../store/hooks";
import { setUser, logout } from "../../../store/slices/authSlice";
//import type { Credentials, SignInResult } from "../../../types/auth";


//3 React Query mutations hooks che utilizzerai nella tua app X SIGNIN-SIGNUP-SIGNOUT
//incapsulano l’autenticazione con Supabase e la sincronizzazione w Redux

export function useSignIn() {
  const dispatch = useAppDispatch();
  const qc = useQueryClient();  //grazie a <QueryClientProvider client={queryClient}>, stai gia utilizzando la tua custom queryClient

  return useMutation({  //x insert/update/delete sul server, invece useQuery() fa solo read
    mutationFn: ({ email, password }: { email: string; password: string }) =>  //funct principale che fa l'operazione
        //riceve obj con dentro email and psw, ma con TS devi specificare i types
      signIn(email, password),  //esegue il mio custom signIn
    onSuccess: ({ user }) => {  //onSuccess riceve l'obj che mutationFn risolve
      dispatch( setUser(user ?? null) );  //setUser è un reduce creato con redux per lo statoo globale
        //se user is null/undefined, allora usa null
      if (user?.id) qc.invalidateQueries({ queryKey: ["user-profile", user.id] }); //"La query con questa chiave è vecchia, rifetchala la prossima volta che serve"
      //invalida la cache del profilo, cosi l'utente evita di entrare con dati nella cache vecchi. now tutto fresh.
    },  
  });
}


export function useSignUp() {
  const dispatch = useAppDispatch();

  return useMutation({
    mutationFn: ({ email, password, redirectTo }: { email: string; password: string; redirectTo?: string }) =>
      signUp(email, password, redirectTo),  //esegue il mio custom signUp presente in services/auth.service.tsx
    onSuccess: ({ user, needsEmailVerification }) => {
      if (user && !needsEmailVerification) {
        dispatch(setUser(user));
      }
      //TODOaltrimenti dovresti mostrare in UI “check ur email per completare l'iscrizione”
    },
  });
}


export function useSignOut() {
  const dispatch = useAppDispatch();
  const qc = useQueryClient();

  return useMutation({
    mutationFn: () => signOut(),
    onSuccess: () => {
      dispatch( logout() );  //semplicemennte esegue il my custom reducer (of redux) logout() 
      qc.clear();   //TODOcancella tutta la cache (tutte le queries) drasticamente, other opts different qc.removeQueries(['user-profile', userId])  or  qc.invalidateQueries()
    },
  });
}
