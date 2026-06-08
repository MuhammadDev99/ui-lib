// packages/ui/src/demos/TextBoxDemo.tsx
'use client';

import { useState } from 'react';
import { TextBox } from '../index';
import { User, Mail, Calendar, Lock } from 'lucide-react';

export default function TextBoxDemo() {
  const [email, setEmail] = useState('');

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '1.5em',
        width: '100%',
      }}
    >
      <p>TextBox</p>

      {/* Basic usage with label and placeholder */}
      <TextBox label="Full name" placeholder="Enter your full name" />

      {/* With an icon and tooltip */}
      <TextBox
        label="Email address"
        icon={Mail}
        tooltip="We’ll never share your email."
        placeholder="you@example.com"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      {/* Required with validation */}
      <TextBox
        label="Password"
        icon={Lock}
        type="password"
        required
        validation={(val) =>
          val.length < 8 ? 'Password must be at least 8 characters' : null
        }
        placeholder="At least 8 characters"
      />

      {/* Read‑only field */}
      <TextBox label="Account ID" value="ACC-123456789" readOnly icon={User} />

      {/* Date input (Date object support) */}
      <TextBox
        label="Date of birth"
        type="date"
        icon={Calendar}
        defaultValue={new Date('1995-06-15')}
      />

      {/* External error state */}
      <TextBox
        label="Username"
        error="This username is already taken."
        placeholder="Choose a username"
      />
    </div>
  );
}
