import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/index.css'
import { RouterProvider } from 'react-router'

import { ThemeProvider } from './contexts/theme-provider'
import rootRouter from './routes/rootRoutes'
import { Provider } from 'react-redux'
import { store } from './store/store'
import { Toaster } from './components/ui/sonner'

// Protect against malicious browser extensions trying to modify React internals
if (typeof window !== 'undefined') {
  const originalDefineProperty = Object.defineProperty;
  Object.defineProperty = function<T>(
    o: T,
    p: PropertyKey,
    attributes: PropertyDescriptor
  ): T {
    try {
      return originalDefineProperty(o, p, attributes);
    } catch (e) {
      console.warn('Failed to define property:', p, e);
      return o;
    }
  };
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
    <ThemeProvider>
      <Toaster position='top-right' />
      <RouterProvider router={rootRouter}></RouterProvider>
    </ThemeProvider>
    </Provider>
  </StrictMode>,
)
