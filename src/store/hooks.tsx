import { useDispatch, useSelector } from "react-redux";
import type { TypedUseSelectorHook } from "react-redux";
import type { RootState, AppDispatch } from "./store";

export const useAppDispatch = () => useDispatch<AppDispatch>();  //versione tipizzata di useDispatch, ora è sicuro w TS
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;  //versione tipizzata di useSelector, ora è sicuro w TS

//ORA UTILIZZERAI QUESTI 2 CUSTOM SECURED HOOKS useAppDispatch & useAppSelectoral posto di quelli basic useDispatch & useSelector !!
//ora hai security ok Redux Toolkit + TypeScript

//e.g.
//Aggiornare → const dispatch = useAppDispatch();  dispatch(setLoading(true|false))
//Leggere → useAppSelector(state => state.auth.loading)