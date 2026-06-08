import React from 'react';
import ReactDOM from 'react-dom/client';
import { Button } from './index';

// Optional: import global CSS variables if you add them later
// import './styles/global.css';

const App = () => (
  <div style={{ padding: '2rem', display: 'flex', gap: '1rem' }}>
    <Button variant="normal">Normal</Button>
    <Button variant="primary">Primary</Button>
  </div>
);

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);
