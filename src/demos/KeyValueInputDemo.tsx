'use client';
import { useState } from 'react';
import { KeyValueInput, type KeyValuePair } from '../index';

export default function KeyValueInputDemo() {
  const [attributes, setAttributes] = useState<KeyValuePair[]>([
    { key: 'Color', value: 'Red' },
  ]);

  return (
    <div>
      <p>KeyValueInput</p>
      <KeyValueInput
        label="Product Attributes"
        value={attributes}
        onChange={setAttributes}
        maxItems={10}
      />
    </div>
  );
}
