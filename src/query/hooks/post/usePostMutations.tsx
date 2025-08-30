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

function getUploadPath(file: File, postId: string, userId?: string) {
  const ext = file.name.split(".").pop();  //prende l'ultima parte del nome file, cioe l'estensione e.g. png/jpg/mp3/ect
  if (file.type.startsWith("image/")) {
    const path = userId
      ? `users/${userId}/avatar.${ext}`   // per avatar
      : `posts/${postId}/${uuidv4()}.${ext}`; // per post, uuidv4() genera un id univoco, cosi ora il key è davvero univoco per questo media
    return { bucket: "images", path, type: "image" };
  }
  if (file.type.startsWith("video/")) {
    return { bucket: "videos", path: `posts/${postId}/${uuidv4()}.${ext}`, type: "video" };
  }
  // altrimenti documenti
  return { bucket: "documents", path: `posts/${postId}/${uuidv4()}.${ext}`, type: "document" };
}

export function useCreatePost() {
  const qc = useQueryClient();
  return useMutation({

    mutationFn: async (formData: CreatePostInput) => {  //funct principale che fa l'operazione

      const { data: post, error: postError } = await supabase  //da supabase come result ottieni {..,data,error,...}, qua li rinomini semplicemente in 'post' e 'postError'
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
      const createdPost: PostDBFormat = post;

      //upload media se esistono
      const files = formData.mediaFiles;
      if (files && files.length > 0) {
        for (let i = 0; i < files.length; i++) {
          const file = files[i];
          const { bucket, path, type } = getUploadPath(file, createdPost.id, formData.userId);
          
          const { error: uploadError } = await supabase.storage
            .from(bucket)  //seleziona il bucket target
            .upload(path, file, { upsert: false });  //carica il file sotto la chiave key, upsert non sovrascrive se esiste gia una key identica salvata(possibilita al 50% dopo 100anni,quindi ok) ma lancia errore se cio accade
          if (uploadError) throw uploadError;

          //recupera URL (signed se video/document)
          const urlData = 
            bucket === "videos" || bucket === "documents"  //cioe quelli che su supabase sono privati
              ? await supabase.storage.from(bucket).createSignedUrl(path, 60*60)  //1h di tempo in cui il link è valido
              : supabase.storage.from(bucket).getPublicUrl(path);
          const url = bucket === "videos" || bucket === "documents"
            ? urlData.signedUrl
            : urlData.publicUrl;

          //inserisci metadata nella tab media
          const { error: mediaError } = await supabase.from("media").insert([{
            post_id: createdPost.id,
            url,
            type,
          }]);
          if (mediaError) throw mediaError;
        }
      }

      return createdPost;
    },

    onMutate: async (newPost) => {  //eseguita poco prima che la mutation effettiva venga inviata al server
      await qc.cancelQueries({ queryKey: ["posts", "feed"] });  //ferma eventuali cachequery su cache ["posts", "feed",...]
      const previous = qc.getQueryData<unknown>(["posts", "feed"]);  //save lo stato attuale di cache ["posts", "feed",...], serve se per caso dovrai fare rollerback a causa di un errore
      
      const tempPost: Partial<PostDBFormat> = { //crei post sample easy
        id: `temp-${uuidv4()}`,
        author_id: newPost.userId,
        content: newPost.content,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      qc.setQueryData(["posts", "feed"], (old: unknown) => {
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
    onError: (err, _newPost, ctx: unknown) => {  //se la mutation fallisce, ripristina tutto a stato precedente (ctx.previous)
      qc.setQueryData(["posts", "feed"], ctx.previous); 
      console.error("create post failed", err); 
    },
    onSettled: () => {  //dopo che la mutation è successo/failure, cmnq invalidi la cache x cache["posts", "feed",..](cioe quella x il feed)
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
