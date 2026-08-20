import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { ErrorBoundary } from './components/common/ErrorBoundary.tsx';
import './index.css';

// Safety hook to protect against extension proxy injection conflicts
try {
  if (typeof window !== 'undefined' && !(window as any).tronlinkParams) {
    let _val: any;
    Object.defineProperty(window, 'tronlinkParams', {
      configurable: true,
      enumerable: true,
      get() { return _val; },
      set(v) { _val = v; return true; }
    });
  }
} catch {
  // Ignore
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </StrictMode>,
);

