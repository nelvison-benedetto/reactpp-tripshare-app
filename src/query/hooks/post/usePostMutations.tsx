import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../libs/supabaseClient";
import type { PostDBFormat } from "../../../types/db";

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (newPost: Partial<PostDBFormat>) => {
      const { data, error } = await supabase  //here qua sotto crea la query sql (non importa l'ordine e.g. se select() è dopo .eq())
        .from("posts")
        .insert(newPost)  //inserisce new record nella tabella (fa un INSERT INTO posts ...)
        .select()  //come in sql SELECT vuoi un return
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["posts"] });  //"La query con questa chiave è vecchia, rifetchala la prossima volta che serve"
    },
  });
}

export function useUpdatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async ({ id, ...updates }: Partial<PostDBFormat> & { id: string }) => {
      const { data, error } = await supabase
        .from("posts")
        .update(updates)  //aggiorna il record
        .eq("id", id)  //filtro
        .select()  //come in sql SELECT vuoi un return
        .single();
      if (error) throw error;
      return data;
    },
    onSuccess: (data) => {
      qc.setQueryData(["post", data.id], data);
      qc.invalidateQueries({ queryKey: ["posts"] }); //"La query con questa chiave è vecchia, rifetchala la prossima volta che serve"
    },
  });
}

export function useDeletePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from("posts")
        .delete()  //elimina il record
        .eq("id", id);
      if (error) throw error;
      return id;
    },
    onSuccess: (id) => {
      qc.removeQueries({ queryKey: ["post", id] });
      qc.invalidateQueries({ queryKey: ["posts"] }); //"La query con questa chiave è vecchia, rifetchala la prossima volta che serve"
    },
  });
}
