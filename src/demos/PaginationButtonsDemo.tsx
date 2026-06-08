// packages/ui/src/demos/PaginationButtonsDemo.tsx
'use client';

import { useState } from 'react';
import { PaginationButtons } from '../index';

export default function PaginationButtonsDemo() {
  const [page, setPage] = useState(0);

  return (
    <>
      <p>PaginationButtons</p>
      <PaginationButtons pagesCount={7} selectedPage={page} onPage={setPage} />
    </>
  );
}
