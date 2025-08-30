// query/hooks/post/usePostsFeed.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "../../../libs/supabaseClient";
import type { PostDBFormat } from "../../../types/db";

type Params = {
  limit?: number;          //quanti posts x pages
  authorId?: string;       //filtra x author
};

type Page = { 
    items: PostDBFormat[]; 
    nextCursor: string | null;  //cursore, valore da cui ripartire per caricare la prossima pagina
      //use string bc usi 'create_at' per settarlo di volta in volta
};

export function usePostsFeed({ limit = 12, authorId }: Params = {}) {  //limit=12 di default se non riceve limit, = {} significa se non passi nessun parametro a usePostsFeed allora usa obj vuoto( {} )

  return useInfiniteQuery<Page, Error>({  //useInfiniteQuery() come usequery() ma gestisce pagine multiple (nel mio caso mi serve x infinite scroll)
       //puo ritornare anche un type di Error
    queryKey: ["posts", "feed", { authorId, limit }],
    initialPageParam: null as string | null,   //prima query: pageParam = null, pagine successive: pageParam = string (cioè il created_at dell’ultimo post) | null
    queryFn: async ({ pageParam }) => { //il parametro pageParam deve essere string | null, questa è la semplice query di fetch
        //!!pageParam è un paramentro interno di useInfiniteQuery(): al primo cycle prende initialPageParam, dopo prende il result di getNextPageParam
      let q = supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit + 1);   //prende 1 post extra per capire se esiste una prossima pagina
      if (authorId) q = q.eq("author_id", authorId);  //se authorId in q esiste, allora setta eq (filtro)
      if (pageParam) q = q.lt("created_at", pageParam); //se pageParam in q esiste(diverso da null), DAMMI I POSTS CON 'created_at'
        //PIU VECCHI DI pageParam (che è un created_at), quaindi a livello visisvo piu scrolli piu le pagine hanno i post piu vecchi (ordinati anche in ogni pagina)

      const { data, error } = await q;
      if (error) throw error;

      const hasMore = (data?.length ?? 0) > limit;  //se data esiste usa data.lenght, se invece è null/undefined allora setta 0
        //è un boolean,  se il .limit(limit + 1); ha avuto successo quindi e.g. hai caricato 13posts avendo pero un limit di 12, allora hasMore=true
      const items = hasMore ? (data as PostDBFormat[]).slice(0, limit) : (data ?? []);  //nel secondo caso se hasMore=false, mostra tutti i dati altrimenti se data=null mostra srray vuoto ( [] )
      const nextCursor = hasMore ? items[items.length - 1].created_at : null;  //se cis sono altri posts->setta nextCursor = created_at dell’ultimo post caricato in items

      return { items, nextCursor };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,  
      //setta il pageParam x il prossimo cycle di queryFn, gli passi {items,nextCursor} come param, cosi setta il nuovo pageParam
    staleTime: 60_000,  //freshness dei dati= 1minuto

  });
}
