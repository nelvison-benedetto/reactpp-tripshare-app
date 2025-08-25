import './styles/App.css'
import {supabase} from "./libs/supabaseClient";
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout';
import FeedPage from './pages/FeedPage';


type Instrument = {
  id: string;
  name: string;
};
function App() {

  return (
    <>
      <BrowserRouter>
        <Routes>
          <Route element={<Layout/>}>
            <Route path='/' element={<FeedPage/>} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  )
}

export default App
