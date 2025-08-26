import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({  //istanza di QueryClient gestirà cache,fetch,retry,refetch per tutte le query dell’applicazione visto che in app.tsx wrap all w <QueryClientProvider client={queryClient}> 
  defaultOptions: {
    queries: {
      retry: 1,  //quante volte riprova a fare la fetch se fallisce
      refetchOnWindowFocus: false,   //di default reactquery refetcha sempre automaticamente la query quando ritorni sulla tab del browser
                                    //,quindi here set no refesh auto quando torni sulla tab del browser
      staleTime: 1000 * 60,   //1minuto dopo la fetch in cui i dati sono considerati Fresh, poi dopo diventano 'stale'(refetchabili se richiesto)
    },
  },
});