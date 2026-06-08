// packages/ui/src/demos/SelectBoxDemo.tsx
'use client';

import { SelectBox } from '../index';
import { useState } from 'react';

export default function SelectBoxDemo() {
  const [selected, setSelected] = useState<string | number>('');

  return (
    <>
      <p>SelectBox</p>
      <SelectBox
        label="Country"
        placeholder="Select a country"
        options={[
          { display: 'United States', value: 'us' },
          { display: 'Canada', value: 'ca' },
          { display: 'Germany', value: 'de' },
        ]}
        value={selected}
        onChange={setSelected}
      />
    </>
  );
}
