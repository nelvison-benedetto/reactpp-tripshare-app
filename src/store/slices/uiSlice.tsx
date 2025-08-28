import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";

interface UiState {
  darkMode: boolean;
  sidebarOpen: boolean;
}

const initialState: UiState = {
  darkMode: false,
  sidebarOpen: true,
};

const uiSlice = createSlice({  //slice, containing more reducers, createSlice() genera anche uiSlice.actions e uiSlice.reducer
  name: "ui",
  initialState,
  reducers: {
    toggleDarkMode: (state) => {   //reducer, prende lo stato corrente (state) e un'azione (action) e ritorna il nuovo stato
      state.darkMode = !state.darkMode;  //grazie a Immer.js che sotto stotto crea sempre una copia e modifica la copia.
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {   //reducer, PayloadAction<> serve a tipizzazre il payload dell’azione,
        //here TS cosi sa che il payload deve essere obbligatoriamente true/false
      state.sidebarOpen = action.payload;  //override lo stato corrente di user con il nuovo user passato tramite action
        //xk dispatch(setSidebarOpen(true/false)) crea internamente in redux  {type: "ui/setSidebarOpen",payload: true/false} (questo è tutto l'action' insieme)
    },
  },
});

export const { toggleDarkMode, setSidebarOpen } = uiSlice.actions;
  //questo ti permette di usare funzione toggleDarkMode() (che crea in automatico Action { type: "ui/toggleDarkMode" })
  //e funzione setSidebarOpen(here true/false) (che crea in automatico Action { type: "ui/setSidebarOpen", payload: here true/false })
//ora li puoi usare nei componenti:
// const dispatch = useAppDispatch();   
// dispatch(toggleDarkMode());  attiva/disattiva dark mode
// dispatch(setSidebarOpen(false));  chiude la sidebar
  export default uiSlice.reducer;
  //uiSlice.reducer è la funzione pura generata automaticamente da Redux Toolkit, sarebbe l'equivalente scritto a mano di function uiReducer(state = initialState, action: AnyAction){...}  
  //la utilizzi in store/rootReducer perche ha bisogno solo della funzione pura, non dello slice(lo slice non ti serve da nessun'altra parte)

