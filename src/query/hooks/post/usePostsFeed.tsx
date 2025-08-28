// query/hooks/post/usePostsFeed.ts
import { useInfiniteQuery } from "@tanstack/react-query";
import { supabase } from "../../../libs/supabaseClient";
import type { PostDBFormat } from "../../../types/db";

type Params = {
  limit?: number;          //batch size
  authorId?: string;       //opzionale: feed di un autore
};

type Page = { 
    items: PostDBFormat[]; 
    nextCursor: string | null;
};

export function usePostsFeed({ limit = 12, authorId }: Params = {}) {

  return useInfiniteQuery<Page, Error>({  //useInfiniteQuery() come usequery() ma gestisce pagine multiple (nel mio caso mi serve x infinite scroll)
    queryKey: ["posts", "feed", { authorId, limit }],
    initialPageParam: null as string | null,   //la prima pagina parte con null, cursor = created_at dell’ultimo item
    queryFn: async ({ pageParam }) => { //il parametro pageParam dice da dove iniziare la pagina
      let q = supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit + 1);   //+1 per capire se esiste next page

      if (authorId) q = q.eq("author_id", authorId);
      if (pageParam) q = q.lt("created_at", pageParam); // cursor-based

      const { data, error } = await q;
      if (error) throw error;

      const hasMore = (data?.length ?? 0) > limit;
      const items = hasMore ? (data as PostDBFormat[]).slice(0, limit) : (data ?? []);
      const nextCursor = hasMore ? items[items.length - 1].created_at : null;

      return { items, nextCursor };
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    staleTime: 60_000,

  });
}
