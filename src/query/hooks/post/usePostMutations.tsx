import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "../../../libs/supabaseClient";
import type { PostDBFormat } from "../../../types/db";
import { v4 as uuidv4 } from "uuid"; 

type CreatePostInput = {
  content: string;
  location_name?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  mood?: string | null;
  positive_reflection?: string | null;
  negative_reflection?: string | null;
  physical_effort?: number | null;
  economic_effort?: number | null;
  actual_cost?: number | null;
  mediaFiles?: FileList; // opzionale
};

// export function useCreatePost() {  //DONT DELETE!!
//   const qc = useQueryClient();
//   return useMutation({
//     mutationFn: async (newPost: Partial<PostDBFormat>) => {
//       const { data, error } = await supabase  //here qua sotto crea la query sql (non importa l'ordine e.g. se select() è dopo .eq())
//         .from("posts")
//         .insert(newPost)  //inserisce new record nella tabella (fa un INSERT INTO posts ...)
//         .select()  //come in sql SELECT vuoi un return
//         .single();
//       if (error) throw error;
//       return data;
//     },
//     onSuccess: () => {
//       qc.invalidateQueries({ queryKey: ["posts"] });  //"La query con questa chiave è vecchia, rifetchala la prossima volta che serve"
//     },
//   });
// }

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: async (formData: CreatePostInput) => {  //funct principale che fa l'operazione

      const { data: post, error: postError } = await supabase
        .from("posts")
        .insert([{
          content: formData.content,
          location_name: formData.location_name ?? null,
          latitude: formData.latitude ?? null,
          longitude: formData.longitude ?? null,
          mood: formData.mood ?? null,
          positive_reflection: formData.positive_reflection ?? null,
          negative_reflection: formData.negative_reflection ?? null,
          physical_effort: formData.physical_effort ?? null,
          economic_effort: formData.economic_effort ?? null,
          actual_cost: formData.actual_cost ?? null,
        }])
        .select()
        .single();
      if (postError) throw postError;

      //upload media se esistono
      const files = formData.mediaFiles;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const ext = file.name.split(".").pop();
          const key = `posts/${post.id}/${uuidv4()}.${ext}`;
          const { error: uploadError } = await supabase.storage
            .from("media")
            .upload(key, file, { upsert: false });
          if (uploadError) throw uploadError;

          const { data: publicUrlData } = supabase.storage.from("media").getPublicUrl(key);
          const { error: mediaError } = await supabase.from("media").insert([{
            post_id: post.id,
            url: publicUrlData.publicUrl,
            type: file.type.startsWith("image") ? "image" : "video",
          }]);
          if (mediaError) throw mediaError;
        }
      }
      return post as PostDBFormat;
    },
    onMutate: async (newPost) => {
      await qc.cancelQueries({ queryKey: ["posts", "feed"] });
      const previous = qc.getQueryData<any>(["posts", "feed"]);
      const tempPost: Partial<PostDBFormat> = {
        id: `temp-${uuidv4()}`,
        author_id: "me", // TODO: prendi dal contesto user
        content: newPost.content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };
      qc.setQueryData(["posts", "feed"], (old: any) => {
        if (!old) return old;
        const firstPage = old.pages?.[0];
        if (!firstPage) return old;
        return {
          ...old,
          pages: [
            { ...firstPage, items: [tempPost, ...firstPage.items] },
            ...old.pages.slice(1),
          ],
        };
      });
      return { previous };
    },
    onError: (err, _newPost, ctx: any) => {
      qc.setQueryData(["posts", "feed"], ctx.previous);
    },
    onSettled: () => {
      qc.invalidateQueries({ queryKey: ["posts", "feed"] });
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
