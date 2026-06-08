// packages/ui/src/demos/RadioSelectDemo.tsx
'use client';

import { RadioSelect } from '../index';
import { useState } from 'react';

export default function RadioSelectDemo() {
  const [selected, setSelected] = useState('b');

  return (
    <>
      <p>RadioSelect</p>
      <RadioSelect
        label="Choose fruit"
        options={[
          { display: 'Apple', value: 'a' },
          { display: 'Banana', value: 'b' },
          { display: 'Cherry', value: 'c' },
        ]}
        value={selected}
        onChange={setSelected}
      />
    </>
  );
}
