import { useEffect } from "react";
import { supabase } from "../../libs/supabaseClient";
import { useAppDispatch } from "../../store/hooks";
import { setUser, logout } from "../../store/slices/authSlice";

export function useAuthListener() {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        dispatch(setUser(session.user));
      } else {
        dispatch(logout());
      }
    });
    return () => subscription.unsubscribe();
  }, [dispatch]);
}
