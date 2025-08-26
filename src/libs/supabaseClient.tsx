import { createClient } from "@supabase/supabase-js";

//una const xk non ti servono tante istanze
export const supabase = createClient(import.meta.env.VITE_SUPABASE_URL as string, import.meta.env.VITE_SUPABASE_ANON_KEY as string);

