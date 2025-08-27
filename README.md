## Reactpp Trip Share App
Progetto in sviluppo utilizzando Reactjs + Typescript + TailwindCSS + many other libs per creare sito online di viaggi condivisibili tra piu utenti, con visualizzazione mappe, citta, foto personali video e molto altro. Come backend utilizzo di Supabase.

# Backend
- tabelle: users, friendships, follows, posts, likes, comments, media, messages, groups, group_members, notifications, post_tags.
- Utilizzo supabase triggers per aggiornare automaticamente sia quando fai insert/update sia alle 3AM, il field 'recent' (presente solo in alcune tabelle) a 'false' solo se post/comment/ect è piu vecchio di 30/90gg (il calcolo utilizza now() e il field 'updated_at').
- Utilizzo indexes normali e parziali(che prendono solo il subset 'recent'=true) per velocizzare le operazioni di select per queste tabelle.
- Utilizzo di supabase Realtime(utilizza i websocket) su tabs users, posts, comments, messages, notifications.
applicazione di RLS e Policy custom su tabs posts, comments, messages, notifications.

# Frontend
Reactjs + Typescript + TailwindCSS + DaisyUI
- other libs: Redux, React-Query, react-router-dom, react-snap, react-helmet, react-lazy-load-image-component, vite-imagetools, vite-plugin-compression, supabase.

