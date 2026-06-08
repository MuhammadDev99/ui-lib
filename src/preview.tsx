import ReactDOM from 'react-dom/client';
import { LocaleProvider, Button } from './index';
import { Home, Loader2 } from 'lucide-react';
import './styles/global.css' // ensure global styles are loaded

const App = () => (
  <LocaleProvider locale="en">
    <div style={{ padding: '2rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
      <Button>Normal</Button>
      <Button variant="primary">Primary</Button>
      <Button variant="negative">Negative</Button>
      <Button loading>Loading</Button>
      <Button icon={Home} iconRotationDeg={45}>With Icon</Button>
      <Button href="https://example.com">Link Button</Button>
    </div>
  </LocaleProvider>
);

ReactDOM.createRoot(document.getElementById('root')!).render(<App />);