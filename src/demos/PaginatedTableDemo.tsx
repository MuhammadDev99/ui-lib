// packages/ui/src/demos/PaginatedTableDemo.tsx
'use client';

import { useState, useMemo } from 'react';
import { PaginatedTable, TableConfig } from '../index';

type Person = { id: number; name: string; email: string };

const SAMPLE_DATA: Person[] = [
  { id: 1, name: 'Alice', email: 'alice@example.com' },
  { id: 2, name: 'Bob', email: 'bob@example.com' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com' },
  { id: 4, name: 'Diana', email: 'diana@example.com' },
  { id: 5, name: 'Eve', email: 'eve@example.com' },
  { id: 6, name: 'Frank', email: 'frank@example.com' },
];

export default function PaginatedTableDemo() {
  const [page, setPage] = useState(0);
  const [query, setQuery] = useState('');
  const [searchCol, setSearchCol] = useState<keyof Person>('name');
  const [sortCol, setSortCol] = useState<keyof Person>('id');
  const [sortDir, setSortDir] = useState<'asc' | 'desc'>('asc');

  const pageSize = 3;

  const filtered = useMemo(() => {
    let data = SAMPLE_DATA;
    if (query) {
      data = data.filter((item) =>
        String(item[searchCol]).toLowerCase().includes(query.toLowerCase()),
      );
    }
    data = [...data].sort((a, b) => {
      const aVal = a[sortCol];
      const bVal = b[sortCol];
      if (aVal < bVal) return sortDir === 'asc' ? -1 : 1;
      if (aVal > bVal) return sortDir === 'asc' ? 1 : -1;
      return 0;
    });
    return data;
  }, [query, searchCol, sortCol, sortDir]);

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <>
      <p>PaginatedTable</p>
      <PaginatedTable<TableConfig<Person>>
        headers={[
          { display: 'ID', value: 'id', sortable: true },
          { display: 'Name', value: 'name', searchable: true, sortable: true },
          {
            display: 'Email',
            value: 'email',
            searchable: true,
            sortable: true,
          },
        ]}
        data={paginated}
        totalPages={totalPages}
        currentPage={page}
        searchQuery={query}
        searchColumn={searchCol}
        sortColumn={sortCol}
        sortDirection={sortDir}
        onPageChange={(p) => setPage(p)}
        onSearch={(q, col) => {
          setQuery(q);
          setSearchCol(col);
          setPage(0);
        }}
        onSort={(col, dir) => {
          setSortCol(col);
          setSortDir(dir);
          setPage(0);
        }}
        renderItem={(item) => (
          <div key={item.id} style={{ display: 'contents' }}>
            <span>{item.id}</span>
            <span>{item.name}</span>
            <span>{item.email}</span>
          </div>
        )}
      />
    </>
  );
}
