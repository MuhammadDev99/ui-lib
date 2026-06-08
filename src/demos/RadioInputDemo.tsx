// packages/ui/src/demos/RadioInputDemo.tsx
'use client';

import { useState } from 'react';
import { RadioInput } from '../index';

export default function RadioInputDemo() {
  const [checked, setChecked] = useState(false);

  return (
    <>
      <p>RadioInput</p>
      <RadioInput
        name="accept"
        label="I agree to the terms"
        checked={checked}
        onChange={setChecked}
      />
    </>
  );
}
