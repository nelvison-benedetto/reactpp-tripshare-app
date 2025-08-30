import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useCreatePost } from "../../../query/hooks/post/usePostMutations";

const schema = z.object({
  content: z.string().min(1, "Inserisci un testo"),
  mood: z.string().optional(),
  location_name: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  positive_reflection: z.string().optional(),
  negative_reflection: z.string().optional(),
  physical_effort: z.number().min(1).max(5).optional(),
  economic_effort: z.number().min(1).max(5).optional(),
  actual_cost: z.number().optional(),
  mediaFiles: z.any().optional(),
});

type FormValues = z.infer<typeof schema>;

export default function NewPostModal({
  onClose,
  userId,
}: {
  onClose: () => void;
  userId: string;
}) {
  const [localPreviews, setLocalPreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);

  const createPost = useCreatePost();

  const { register, handleSubmit, reset } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { content: "" },
  });

  const onSubmit = async (vals: FormValues) => {
    setUploading(true);
    try {
      await createPost.mutateAsync({ ...vals, userId });
      reset();
      setLocalPreviews([]);
      onClose();
    } finally {
      setUploading(false);
    }
  };

  const onFilesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;
    setLocalPreviews(Array.from(files).map((f) => URL.createObjectURL(f)));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
      <div className="bg-white w-full max-w-2xl rounded-2xl p-6 shadow-xl">
        <header className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Crea un nuovo post</h3>
          <button
            onClick={onClose}
            aria-label="Chiudi"
            className="text-gray-600"
          >
            ✕
          </button>
        </header>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 mt-4">
          <textarea
            {...register("content")}
            placeholder="A cosa stai pensando?"
            className="w-full min-h-[120px] p-3 border rounded-lg"
            disabled={uploading}
          />

          <div className="flex gap-2">
            <label className="cursor-pointer inline-flex items-center gap-2 px-3 py-2 border rounded">
              <input
                type="file"
                accept="image/*,video/*,application/pdf"
                multiple
                {...register("mediaFiles")}
                onChange={onFilesChange}
                className="hidden"
                disabled={uploading}
              />
              <span>📷 Aggiungi foto/video/documenti</span>
            </label>

            <input
              {...register("location_name")}
              placeholder="Luogo (opzionale)"
              className="flex-1 p-2 border rounded"
              disabled={uploading}
            />
          </div>

          {localPreviews.length > 0 && (
            <div className="grid grid-cols-4 gap-2">
              {localPreviews.map((src, i) => (
                <img
                  key={i}
                  src={src}
                  className="w-full h-24 object-cover rounded"
                  alt={`preview-${i}`}
                />
              ))}
            </div>
          )}

          <div className="flex items-center justify-end">
            <button
              type="submit"
              className="px-4 py-2 bg-blue-600 text-white rounded"
              disabled={uploading}
            >
              {uploading ? "Pubblicazione..." : "Pubblica"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
