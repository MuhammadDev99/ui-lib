// packages/ui/src/demos/TextAreaDemo.tsx
'use client';

import { TextArea } from '../index';

export default function TextAreaDemo() {
  return (
    <>
      <p>TextArea</p>
      <TextArea
        label="Description"
        charLimit={100}
        defaultValue="Type something..."
      />
    </>
  );
}
