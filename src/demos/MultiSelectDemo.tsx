// packages/ui/src/demos/MultiSelectDemo.tsx
'use client';

import { useState } from 'react';
import { MultiSelect } from '../index';
import { Camera, Music, Film } from 'lucide-react';

export default function MultiSelectDemo() {
  const [selected, setSelected] = useState<string | number>('music');

  return (
    <>
      <p>MultiSelect</p>
      <MultiSelect
        title="Choose media type"
        items={[
          { label: 'Photos', value: 'photo', icon: Camera },
          { label: 'Music', value: 'music', icon: Music },
          { label: 'Videos', value: 'video', icon: Film },
        ]}
        value={selected}
        onChange={setSelected}
      />
    </>
  );
}
