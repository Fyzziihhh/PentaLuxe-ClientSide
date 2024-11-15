import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import './index.css'; // Your custom styles
import { Provider } from 'react-redux';
import store, { persistor } from './store/store.ts';
import { PersistGate } from 'redux-persist/integration/react';




// Custom theme with dark background and white text color

const rootElement = document.getElementById('root');

if (rootElement) {
  const root = createRoot(rootElement);

  root.render(
    <StrictMode>
      <Provider store={store}>
        <PersistGate loading={null} persistor={persistor}>

          <App />
        </PersistGate>
      </Provider>
    </StrictMode>
  );
}
