import './styles/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout';
import FeedPage from './pages/FeedPage';
import { Provider } from "react-redux";
import { store } from './store/store';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from './query/queryClient';
import { useAuthListener } from './query/hooks/useAuthListener';

function App() {
  
  useAuthListener();

  return (
    <>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <BrowserRouter>
            <Routes>
              <Route element={<Layout />}>
                <Route path="/" element={<FeedPage />} />
              </Route>
            </Routes>
          </BrowserRouter>
        </QueryClientProvider>
      </Provider>
    </>
  );
}

export default App
