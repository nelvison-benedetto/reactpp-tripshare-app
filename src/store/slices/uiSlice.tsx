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
    toggleDarkMode: (state) => {   //reducer
      state.darkMode = !state.darkMode;
    },
    setSidebarOpen: (state, action: PayloadAction<boolean>) => {   //reducer
      state.sidebarOpen = action.payload;
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

