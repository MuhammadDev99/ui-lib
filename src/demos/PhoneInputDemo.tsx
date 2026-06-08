// packages/ui/src/demos/PhoneInputDemo.tsx
'use client';

import { PhoneInput } from '../index';

export default function PhoneInputDemo() {
  return (
    <>
      <p>PhoneInput</p>
      <PhoneInput label="Phone number" required />
    </>
  );
}
