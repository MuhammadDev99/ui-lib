// packages/ui/src/demos/CodeInputDemo.tsx
'use client';

import { CodeInput } from '../index';
import { useRef } from 'react';
import type { FormElementRef } from '../types';

export default function CodeInputDemo() {
  const ref = useRef<FormElementRef>(null);
  return (
    <>
      <p>CodeInput</p>
      <CodeInput length={4} ref={ref} />
      <br />
      <button onClick={() => ref.current?.validate()}>Validate</button>
    </>
  );
}
