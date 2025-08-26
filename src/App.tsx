import './styles/App.css'
import {supabase} from "./libs/supabaseClient";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout';
import FeedPage from './pages/FeedPage';
import { Provider } from "react-redux";
import { store } from './store/store';

function App() {

  return (
    <>
      <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout/>}>
            <Route path='/' element={<FeedPage/>} />
          </Route>
        </Routes>
      </BrowserRouter>
      </Provider>
    </>
  )
}

export default App
