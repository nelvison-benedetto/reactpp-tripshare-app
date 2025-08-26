import { QueryClient } from "@tanstack/react-query";

export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,  //meno retry aggressivi
      refetchOnWindowFocus: false,   //non refetcha ogni volta che torni sulla tab
      staleTime: 1000 * 60,   //1 minuto di "freshness"
    },
  },
});