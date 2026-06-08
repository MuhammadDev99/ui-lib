// packages/ui/src/demos/NumberInputDemo.tsx
'use client';

import { NumberInput } from '../index';

export default function NumberInputDemo() {
  return (
    <>
      <p>NumberInput</p>
      <NumberInput label="Weight" unit="kg" defaultValue={5} min={1} max={20} />
      <br />
      <NumberInput
        label="Price"
        unit="$"
        required
        negative
        message="Required field"
      />
    </>
  );
}
