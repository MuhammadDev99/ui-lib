// packages/ui/src/demos/ButtonDemo.tsx
'use client';

import { Button } from '../index';
import { Home, Loader2 } from 'lucide-react';

export default function ButtonDemo() {
  return (
    <>
      <p>Button</p>
      <div
        style={{
          display: 'flex',
          gap: '0.5rem',
          flexWrap: 'wrap',
          alignItems: 'center',
        }}
      >
        <Button>Normal</Button>
        <Button variant="primary">Primary</Button>
        <Button variant="negative">Negative</Button>
        <Button disabled>Disabled</Button>
        <Button loading></Button>
        <Button icon={Home} iconRotationDeg={45}>
          With Icon
        </Button>
        <Button flipIconOrder icon={Home}>
          Flip Order
        </Button>
        <Button href="https://example.com">Link (a tag)</Button>
      </div>
    </>
  );
}
