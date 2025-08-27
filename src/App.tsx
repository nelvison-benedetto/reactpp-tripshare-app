import './styles/App.css'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './layouts/Layout';
import FeedPage from './pages/FeedPage';
import { Provider } from "react-redux";
import { store } from './store/store';
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from './query/queryClient';
import { useAuthListener } from './query/hooks/useAuthListener';
import TestSignUp from './pages/auth/TestSignUp';

function App() {
  
  function CompUseAuthListener({ children }: { children: React.ReactNode }) {
    useAuthListener();
  return (<> {children} </>);
  }

  return (
    <>
      <Provider store={store}>
        <QueryClientProvider client={queryClient}>
          <CompUseAuthListener>

            <BrowserRouter>
              <Routes>
                <Route element={<Layout />}>

                  <Route path="/" element={<FeedPage />} />
                  <Route path="/testauth" element={<TestSignUp />} />

                </Route>
              </Routes>
            </BrowserRouter>

          </CompUseAuthListener>
        </QueryClientProvider>
      </Provider>
    </>
  );
}

export default App
