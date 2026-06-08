// packages/ui/src/demos/CardDemo.tsx
'use client';

import { Card } from '../index';
import { XCircle, Settings } from 'lucide-react';

export default function CardDemo() {
  return (
    <>
      <p>Card</p>
      <Card title="Information" icon={Settings} onClose={() => alert('Closed')}>
        <p>This is a card with a close button.</p>
      </Card>
    </>
  );
}
