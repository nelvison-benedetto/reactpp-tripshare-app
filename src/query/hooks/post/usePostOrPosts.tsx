import { useQuery } from "@tanstack/react-query";
import { supabase } from "../../../libs/supabaseClient";
import type { PostDBFormat } from "../../../types/db";

export function usePost(postid?: string | null){
    return useQuery<PostDBFormat | null, Error>({
        queryKey: ["post", postid],  //!!array che identifica in modo univoco i dati in cache. e.g ["xxx",1] sarà in cache diversa di ["xxx",2], ovviamente anche l'ordine all'interno di [] è importante x distinguerle
        enabled: Boolean(postid),
        queryFn: async ({queryKey}) =>{
            const id = queryKey[1] as string;
            const {data, error} = await supabase
                .from("posts")
                .select("*")
                .eq("id", id)
                .single();
            if (error) throw error;
            return data;
        },
        staleTime : 1000 * 60,
        retry : 1
    });
}

export function usePosts() {
  return useQuery<PostDBFormat[], Error>({
    queryKey: ["posts"],  //!!array che identifica in modo univoco i dati in cache. e.g ["xxx",1] sarà in cache diversa di ["xxx",2], ovviamente anche l'ordine all'interno di [] è importante x distinguerle
    queryFn: async () => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("recent",true)  //filtra solo quelli con field recent=true
        .order("created_at", { ascending: false });  //ordina i piu recenti x per primi
      if (error) throw error;
      return data;
    },
    staleTime: 1000 * 60,
    retry: 1,
  });
}
