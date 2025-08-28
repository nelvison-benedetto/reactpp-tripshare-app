import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: unknown | null;  //TS preferisce unknown rispetto ad any, pero devo poi sempre fare il check if (user && typeof user === "object" && "name" in user){} ('name' è una key in obj user) 
  loading: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
};

const authSlice = createSlice({  //slice, containing more reducers, createSlice() genera anche authSlice.actions e authSlice.reducer
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<unknown | null>) => {  //reducer, prende lo stato corrente (state) e un'azione (action) e ritorna il nuovo stato
      state.user = action.payload;  //override lo stato corrente di user con il nuovo user passato tramite action
    },  //xk dispatch(setUser(user)) crea internamente in redux  {type: "auth/setUser",payload: user} (questo è tutto l'action' insieme)
    setLoading: (state, action: PayloadAction<boolean>) => {  //reducer, PayloadAction<> serve a tipizzazre il payload dell’azione,
        //here TS cosi sa che il payload deve essere obbligatoriamente true/false
      state.loading = action.payload;
    },
    logout: (state) => {
      state.user = null;
    },
  },
});

export const { setUser, setLoading, logout } = authSlice.actions;
  //questo ti permette di usare funzione setUser() (che crea in automatico Action { type: "auth/setUser" })
  //e funzione setLoading(here true/false) (che crea in automatico Action { type: "auth/setLoading", payload: here true/false })
//ora li puoi usare nei componenti:
// const dispatch = useAppDispatch();   
// dispatch(setUser());  attiva/disattiva dark mode
// dispatch(setLoading(false));  chiude la sidebar
export default authSlice.reducer;
  //authSlice.reducer è la funzione pura generata automaticamente da Redux Toolkit, sarebbe l'equivalente scritto a mano di function authReducer(state = initialState, action: AnyAction){...}  
  //la utilizzi in store/rootReducer perche ha bisogno solo della funzione pura, non dello slice(lo slice non ti serve da nessun'altra parte)


//MORE NOTES on store/slices/uiSlice.tsx