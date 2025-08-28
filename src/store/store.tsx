import { configureStore } from "@reduxjs/toolkit";
import { rootReducer } from "./rootReducer";

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>  //middleware by Redux Toolkit che si infila tra dispatch di un'azione e l'arrivo al reducer.
    getDefaultMiddleware({               //w redux-thunk puoi creare anche azioni asynch (dispatch(asyncAction))
      serializableCheck: false,   //disattivi questo controllo x errori xk magari usi obj non serializzati(e.g. istanze di classi, Date, File, ecc.)
    }),
  devTools: import.meta.env.DEV,   //!!!abilita Redux DevTools solo in dev, in produzione non ti serve
});

export type RootState = ReturnType<typeof store.getState>;   //.getState ritorna lo stato globale di Redux(tutti i reducer combinati)
export type AppDispatch = typeof store.dispatch;   //.dispatch è la funzione che mandi per eseguire un’azione
  //dunque RootState e AppDispatch settano il proprio type
  //e.g. ora puoi usare in target file const dispatch = useDispatch<AppDispatch>();  const user = useSelector((state: RootState) => state.user);
  // MA SE NON VUOI OGNI VOLTA SPECIFICARE IL TYPE IN FILE TARGET, set (come ho gia fatto) useAppDispatch & useAppSelector in store/hooks.tsx 
