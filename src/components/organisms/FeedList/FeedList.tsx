import { useMemo, useRef, useEffect } from "react"; //hooks react
import { Link } from "react-router-dom";
import { usePostsFeed } from "../../../query/hooks/post/usePostsFeed";
import { useRealtimePostsFeed } from "../../../query/hooks/post/useRealtimePostsFeed";

export default function FeedList() {
  const {
    data, //contiene tutte le pagine caricate (data.pages), ogni pagina ha { items, nextCursor }
    isLoading, //true se la query iniziale è in corso
    isError,
    error, //stato di errore se la query fallisce
    fetchNextPage, //funzione per caricare la pagina successiva (React Query)
    hasNextPage, //true/false se ci sono altre pagine
    isFetchingNextPage, //true se React Query sta caricando la prossima pagina
  } = usePostsFeed({ limit: 12 });

  useRealtimePostsFeed();

  //flatten delle pagine
  const posts = useMemo(  //useMemo SALVA IN CACHE IL RISULTATO, lo ricalcola solo se [data] cambia. 
    // non si ricalcola automaticamnete quindi re-renderizza se cambia hasNextPage,isFetching,ect. molto piu efficente!!
    //re-executed when [data] changes
    () => data?.pages.flatMap((p) => p.items) ?? [], //se data esiste, esegui .pages (data.pages è un array di pagine)
    //flatMap((p) => p.items) prende tutti i post da tutte le pagine e li mette in un unico array piatto
    [data]
  );

  //infinite scroll con IntersectionObserver
  const sentinelRef = useRef<HTMLDivElement | null>(null); //inizialmente null, useRef x creare puntatore a un elemento DOM (HTMLDivElement) che persiste tra i render
  useEffect(() => {
    if (!hasNextPage || !sentinelRef.current) return; //se non ci sono altre pagine or sentinelRef.current is null non serve ossarvare nulla, quindi esci subito
    const el = sentinelRef.current;

    const obs = new IntersectionObserver((entries) => {
      //IntersectionObserver p un api browser che osserva quando un item entra nella viewport
      //entries è array di elementi osservati (w con info su visibilità)
      if (entries.some((e) => e.isIntersecting)) fetchNextPage(); //isIntersecting is true se l'elemento è visibile
    });

    obs.observe(el); //attacca l’osservatore al div della sentinella, quindi ora il browser monitora quando il div entra nel viewport
    return () => obs.unobserve(el); //cleanup, evita memory leak quando il componente si smonta
  }, [hasNextPage, fetchNextPage]);

  if (isLoading) {
    return (
      <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {Array.from({ length: 8 }).map(
          (item,index //genera array di 8 elements, per ciascuno setta html+tailwindcss
          ) => (
            <div
              key={index}
              className="h-48 rounded-2xl bg-gray-200 animate-pulse"
            />
          )
        )}
      </section>
    );
  }

  if (isError) {
    return (
      <div className="p-4">
        <p className="text-red-600 font-medium">
          Errore nel caricamento del feed.
        </p>
        <pre className="text-xs opacity-70 mt-2">
          {String(error?.message ?? error)}
        </pre>
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
            <div className="text-xs opacity-60">
              {new Date(item.created_at).toLocaleString()}
            </div>
            <p className="mt-2">{item.content}</p>
          </article>
        ))}
      </section>

      {/* Sentinel per auto-caricare la pagina successiva */}
      <div ref={sentinelRef} className="h-12 flex items-center justify-center">
        {" "}
        {/* collega il div alla sentinella usata dall’IntersectionObserver */}
        {isFetchingNextPage ? (
          <span className="text-sm opacity-70">Caricamento…</span>
        ) : hasNextPage ? (
          <span className="text-sm opacity-70">Scorri per altri post</span>
        ) : (
          <span className="text-sm opacity-70">
            Hai visto tutti i posts permessi!!
          </span>
        )}
      </div>

      <div className="p-4">
        <Link to="/testauth" className="text-blue-600 underline">
          Vai alla pagina di test auth
        </Link>
      </div>
    </>
  );
}
