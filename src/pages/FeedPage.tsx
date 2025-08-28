// pages/FeedPage.tsx
import { useMemo, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import { usePostsFeed } from "../query/hooks/post/usePostsFeed";
import { useRealtimePostsFeed } from "../query/hooks/post/useRealtimePostsFeed";
// import PostCard from "../components/post/PostCard";

export default function FeedPage() {
  const {
    data,
    isLoading,
    isError,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = usePostsFeed({ limit: 12 });

  useRealtimePostsFeed();

  // Flatten delle pagine
  const posts = useMemo(
    () => data?.pages.flatMap((p) => p.items) ?? [],
    [data]
  );

  // Infinite scroll con IntersectionObserver
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasNextPage || !sentinelRef.current) return;
    const el = sentinelRef.current;

    const obs = new IntersectionObserver((entries) => {
      if (entries.some((e) => e.isIntersecting)) fetchNextPage();
    });

    obs.observe(el);
    return () => obs.unobserve(el);
  }, [hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-48 rounded-2xl bg-gray-200 animate-pulse" />
        ))}
      </section>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <p className="text-red-600 font-medium">Errore nel caricamento del feed.</p>
        <pre className="text-xs opacity-70 mt-2">{String(error?.message ?? error)}</pre>
      </div>
    );
  }

  if (posts.length === 0) {
    return (
      <div className="p-6 text-center">
        <p className="text-lg">Nessun post disponibile.</p>
        <Link to="/testauth" className="text-blue-600 underline">
          Vai alla pagina di test auth
        </Link>
      </div>
    );
  }

  return (
    <>
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {posts.map((item) => (
          // Sostituisci con il tuo componente
          // <PostCard key={item.id} data={item} />
          <article key={item.id} className="rounded-2xl border p-4">
            <div className="text-xs opacity-60">{new Date(item.created_at).toLocaleString()}</div>
            <p className="mt-2">{item.content}</p>
          </article>
        ))}
      </section>

      {/* Sentinel per auto-caricare la pagina successiva */}
      <div ref={sentinelRef} className="h-12 flex items-center justify-center">
        {isFetchingNextPage
          ? <span className="text-sm opacity-70">Caricamento…</span>
          : hasNextPage
            ? <span className="text-sm opacity-70">Scorri per altri post</span>
            : <span className="text-sm opacity-70">Hai visto tutto 🎉</span>}
      </div>

      <div className="p-4">
        <Link to="/testauth" className="text-blue-600 underline">
          Vai alla pagina di test auth
        </Link>
      </div>
    </>
  );
}
