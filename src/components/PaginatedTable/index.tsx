'use client';
import '../../styles/global.css';
import React, { useMemo, useState, useEffect } from 'react';
import clsx from 'clsx';
import { ArrowUp, ArrowDown, Search } from 'lucide-react';
import { SelectBox } from '../inputs/SelectBox';
import { PaginationButtons } from '../PaginationButtons';
import type { TableConfig } from '../../types/pagination';
import styles from './style.module.css';

export interface PaginatedTableProps<C extends TableConfig> {
  className?: string;
  /** Column definitions */
  headers: C['headers'][];
  /** Optional CSS grid-template-columns value */
  gridTemplate?: string;
  /** Optional heading */
  label?: string;
  /** The displayed rows */
  data: C['row'][];
  /** Total number of pages */
  totalPages: number;
  /** Current page index (0‑based) */
  currentPage: number;
  /** Current search string (controlled) */
  searchQuery?: string;
  /** Currently selected column for search */
  searchColumn?: C['keys'];
  /** Currently sorted column */
  sortColumn?: C['keys'];
  /** Sort direction */
  sortDirection?: 'asc' | 'desc';
  /** Called when the page changes */
  onPageChange: (page: number) => void;
  /** Called when a search is submitted (query + column) */
  onSearch: (query: string, column: C['keys']) => void;
  /** Called when the sort column or direction changes */
  onSort: (column: C['keys'], direction: 'asc' | 'desc') => void;
  /** Row renderer */
  renderItem: (item: C['row'], isPending: boolean) => React.ReactNode;
  /** Optional external loading flag */
  isPending?: boolean;
}

export function PaginatedTable<C extends TableConfig>({
  className,
  headers,
  gridTemplate,
  label,
  data,
  totalPages,
  currentPage,
  searchQuery = '',
  searchColumn: controlledSearchColumn,
  sortColumn: controlledSortColumn,
  sortDirection = 'desc',
  onPageChange,
  onSearch,
  onSort,
  renderItem,
  isPending = false,
}: PaginatedTableProps<C>) {
  // ───── header filters ─────
  const searchableHeaders = useMemo(
    () => headers.filter((h) => h.searchable),
    [headers],
  );
  const sortableHeaders = useMemo(
    () => headers.filter((h) => h.sortable),
    [headers],
  );
  const visibleHeaders = useMemo(
    () => headers.filter((h) => !h.hidden),
    [headers],
  );

  // defaults for search column and sort column
  const defaultSearchCol = (searchableHeaders[0]?.value ?? '') as C['keys'];
  const defaultSortCol = (sortableHeaders[0]?.value ?? '') as C['keys'];

  const effectiveSearchColumn = controlledSearchColumn ?? defaultSearchCol;
  const effectiveSortColumn = controlledSortColumn ?? defaultSortCol;

  // ───── local search input state ─────
  const [searchInputValue, setSearchInputValue] = useState(searchQuery);
  const [selectedSearchColumn, setSelectedSearchColumn] = useState<C['keys']>(
    effectiveSearchColumn,
  );

  // sync external searchQuery & column changes
  useEffect(() => {
    setSearchInputValue(searchQuery);
  }, [searchQuery]);

  useEffect(() => {
    setSelectedSearchColumn(effectiveSearchColumn);
  }, [effectiveSearchColumn]);

  // ───── handlers ─────
  const handleSearchSubmit = () => {
    onSearch(searchInputValue.trim(), selectedSearchColumn);
  };

  const handleSearchKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSearchSubmit();
    }
  };

  const handleSearchColumnChange = (col: string) => {
    const newCol = col as C['keys'];
    setSelectedSearchColumn(newCol);
    // immediately trigger search with current query
    onSearch(searchInputValue.trim(), newCol);
  };

  const handleSortChange = (col: C['keys'], dir: 'asc' | 'desc') => {
    onSort(col, dir);
  };

  // ───── computed grid style ─────
  const effectiveGridTemplate =
    gridTemplate ?? `repeat(${visibleHeaders.length}, 1fr)`;

  return (
    <div
      className={clsx(styles.root, className)}
      style={
        { '--grid-template': effectiveGridTemplate } as React.CSSProperties
      }
    >
      {label && <p className={styles.title}>{label}</p>}

      {/* Search bar */}
      <div className={styles.searchWrapper}>
        <div className={styles.searchInputGroup}>
          <input
            type="text"
            value={searchInputValue}
            onChange={(e) => setSearchInputValue(e.target.value)}
            onKeyDown={handleSearchKeyDown}
            placeholder="Search..."
            className={styles.searchInput}
          />
          <button
            type="button"
            className={styles.searchButton}
            onClick={handleSearchSubmit}
            aria-label="Search"
          >
            <Search size={16} />
          </button>
        </div>

        <div className={styles.searchOptions}>
          {searchableHeaders.length > 0 && (
            <div className={styles.searchFilterWrapper}>
              <p>داخل</p>
              <SelectBox
                options={searchableHeaders.map((h) => ({
                  display: h.display,
                  value: h.value,
                }))}
                value={selectedSearchColumn}
                onChange={handleSearchColumnChange}
              />
            </div>
          )}
          {sortableHeaders.length > 0 && (
            <div className={styles.searchSortWrapper}>
              <p>رتب حسب</p>
              <SelectBox
                options={sortableHeaders.map((h) => ({
                  display: h.display,
                  value: h.value,
                }))}
                value={effectiveSortColumn}
                onChange={(value) =>
                  handleSortChange(value as C['keys'], sortDirection)
                }
              />
              <div className={styles.sortDirectionButtons}>
                <button
                  type="button"
                  className={clsx(
                    styles.sortButton,
                    sortDirection === 'asc' && styles.activeSort,
                  )}
                  onClick={() => handleSortChange(effectiveSortColumn, 'asc')}
                  aria-label="Sort ascending"
                >
                  <ArrowUp size={16} />
                </button>
                <button
                  type="button"
                  className={clsx(
                    styles.sortButton,
                    sortDirection === 'desc' && styles.activeSort,
                  )}
                  onClick={() => handleSortChange(effectiveSortColumn, 'desc')}
                  aria-label="Sort descending"
                >
                  <ArrowDown size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Header row */}
      <div className={styles.header}>
        {visibleHeaders.map((header) => (
          <p key={header.value}>{header.display}</p>
        ))}
      </div>

      {/* Data rows */}
      <div className={styles.items}>
        {data.map((item) => renderItem(item, isPending))}
      </div>

      {/* Pagination */}
      <PaginationButtons
        className={styles.pagination}
        onPage={onPageChange}
        selectedPage={currentPage}
        pagesCount={totalPages}
      />
    </div>
  );
}
