// packages/ui/src/demos/ToggleInputDemo.tsx
'use client';

import { useState } from 'react';
import { ToggleInput } from '../index';

export default function ToggleInputDemo() {
  const [on, setOn] = useState(false);

  return (
    <>
      <p>ToggleInput</p>
      <ToggleInput label="Airplane mode" checked={on} onChange={setOn} />
    </>
  );
}
