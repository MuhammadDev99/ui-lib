// packages/ui/src/demos/ErrorDisplayDemo.tsx
'use client';

import { ErrorDisplay } from '../index';

export default function ErrorDisplayDemo() {
  return (
    <>
      <p>ErrorDisplay</p>
      <ErrorDisplay
        title="Oops!"
        message="Something went wrong"
        reset={() => alert('Retry')}
        error={new Error('Sample error')}
      />
    </>
  );
}
