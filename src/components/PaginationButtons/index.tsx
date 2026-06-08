'use client';
import '../../styles/global.css';
import clsx from 'clsx';
import { useCallback, useLayoutEffect, useRef, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useLocale } from '../../contexts/LocaleContext';
import { paginationButtonsLocale } from './locale';
import styles from './style.module.css';

export interface PaginationButtonsProps {
  className?: string;
  onPage: (page: number) => void;
  pagesCount: number;
  selectedPage: number;
  /** Custom label for the previous button (default from locale) */
  prevLabel?: string;
  /** Custom label for the next button (default from locale) */
  nextLabel?: string;
}

export function PaginationButtons({
  className,
  onPage,
  pagesCount,
  selectedPage,
  prevLabel,
  nextLabel,
}: PaginationButtonsProps) {
  const { locale } = useLocale();
  const t =
    paginationButtonsLocale[locale as keyof typeof paginationButtonsLocale] ??
    paginationButtonsLocale.en;

  // Use prop if provided, otherwise locale string
  const displayPrevLabel = prevLabel ?? t.prev;
  const displayNextLabel = nextLabel ?? t.next;

  const containerRef = useRef<HTMLDivElement>(null);
  const prevBtnRef = useRef<HTMLDivElement>(null);
  const nextBtnRef = useRef<HTMLDivElement>(null);
  const hiddenListRef = useRef<HTMLDivElement>(null);

  const [visiblePages, setVisiblePages] = useState<number[]>([]);
  const selectedPageRef = useRef(selectedPage);
  selectedPageRef.current = selectedPage;

  const calculateVisibleRange = useCallback(() => {
    const container = containerRef.current;
    const prevBtn = prevBtnRef.current;
    const nextBtn = nextBtnRef.current;
    const hiddenList = hiddenListRef.current;

    if (!container || !prevBtn || !nextBtn || !hiddenList) return;

    const containerRect = container.getBoundingClientRect();
    const computedStyle = window.getComputedStyle(container);
    const paddingLeft = parseFloat(computedStyle.paddingLeft) || 0;
    const paddingRight = parseFloat(computedStyle.paddingRight) || 0;
    const gap = parseFloat(computedStyle.gap) || 0;

    const innerWidth = containerRect.width - paddingLeft - paddingRight - 2;
    const prevWidth = prevBtn.getBoundingClientRect().width;
    const nextWidth = nextBtn.getBoundingClientRect().width;
    const availableForNumbers = innerWidth - prevWidth - nextWidth - gap * 2;

    const allButtons = Array.from(hiddenList.children) as HTMLElement[];
    const buttonWidths = allButtons.map(
      (btn) => btn.getBoundingClientRect().width,
    );

    const getRequiredWidth = (indices: number[]) => {
      if (indices.length === 0) return 0;
      const totalBtnWidth = indices.reduce(
        (sum, idx) => sum + buttonWidths[idx],
        0,
      );
      const totalGaps = (indices.length - 1) * gap;
      return totalBtnWidth + totalGaps;
    };

    const allIndices = Array.from({ length: pagesCount }, (_, i) => i);
    if (getRequiredWidth(allIndices) <= availableForNumbers) {
      setVisiblePages(allIndices);
      return;
    }

    const avgBtnWidth = buttonWidths.reduce((a, b) => a + b, 0) / pagesCount;
    const estimatedMaxFit = Math.floor(
      (availableForNumbers + gap) / (avgBtnWidth + gap),
    );

    if (estimatedMaxFit >= 4) {
      const firstIdx = 0;
      const lastIdx = pagesCount - 1;
      let start = selectedPageRef.current;
      let end = selectedPageRef.current;

      while (true) {
        const canL = start > firstIdx + 1;
        const canR = end < lastIdx - 1;
        if (!canL && !canR) break;

        if (canR) {
          const testSet = Array.from(
            new Set([
              firstIdx,
              ...Array.from({ length: end - start + 2 }, (_, i) => start + i),
              lastIdx,
            ]),
          ).sort((a, b) => a - b);
          if (getRequiredWidth(testSet) <= availableForNumbers) end++;
          else break;
        }
        if (canL) {
          const testSet = Array.from(
            new Set([
              firstIdx,
              ...Array.from(
                { length: end - start + 2 },
                (_, i) => start - 1 + i,
              ),
              lastIdx,
            ]),
          ).sort((a, b) => a - b);
          if (getRequiredWidth(testSet) <= availableForNumbers) start--;
          else break;
        }
      }

      const resultSet = new Set<number>([firstIdx, lastIdx]);
      for (let i = start; i <= end; i++) resultSet.add(i);
      setVisiblePages(Array.from(resultSet).sort((a, b) => a - b));
    } else {
      let start = selectedPageRef.current;
      let end = selectedPageRef.current;
      while (true) {
        const canR = end < pagesCount - 1;
        const canL = start > 0;
        if (canR) {
          const test = Array.from(
            { length: end - start + 2 },
            (_, i) => start + i,
          );
          if (getRequiredWidth(test) <= availableForNumbers) end++;
          else break;
        }
        if (canL) {
          const test = Array.from(
            { length: end - start + 2 },
            (_, i) => start - 1 + i,
          );
          if (getRequiredWidth(test) <= availableForNumbers) start--;
          else break;
        }
        if (!canL && !canR) break;
      }
      setVisiblePages(
        Array.from({ length: end - start + 1 }, (_, i) => start + i),
      );
    }
  }, [pagesCount]);

  useLayoutEffect(() => {
    const observer = new ResizeObserver(calculateVisibleRange);
    if (containerRef.current) observer.observe(containerRef.current);
    calculateVisibleRange();
    return () => observer.disconnect();
  }, [calculateVisibleRange]);

  const handlePageClick = (page: number) => {
    onPage(page);
  };

  return (
    <div
      ref={containerRef}
      className={clsx(styles.root, className)}
      dir={locale.startsWith('ar') ? 'rtl' : 'ltr'}
    >
      {/* Hidden measurement layer */}
      <div
        className={styles.hiddenMeasurement}
        ref={hiddenListRef}
        aria-hidden="true"
      >
        {Array.from({ length: pagesCount }).map((_, i) => (
          <button key={i} className={styles.button} type="button">
            {i + 1}
          </button>
        ))}
      </div>

      {/* Previous button */}
      <div ref={prevBtnRef} className={styles.sideButton}>
        <button
          type="button"
          className={styles.button}
          onClick={() => handlePageClick(selectedPage - 1)}
          disabled={selectedPage === 0}
          aria-label={displayPrevLabel}
        >
          <ChevronLeft size={16} />
          <span>{displayPrevLabel}</span>
        </button>
      </div>

      {/* Numbered page buttons */}
      <div className={styles.numberedButtons}>
        {pagesCount > 1 &&
          visiblePages.map((pageIndex) => (
            <button
              key={pageIndex}
              type="button"
              className={clsx(
                styles.button,
                selectedPage === pageIndex && styles.selected,
              )}
              onClick={() => handlePageClick(pageIndex)}
              aria-current={selectedPage === pageIndex ? 'page' : undefined}
            >
              {pageIndex + 1}
            </button>
          ))}
      </div>

      {/* Next button */}
      <div ref={nextBtnRef} className={styles.sideButton}>
        <button
          type="button"
          className={styles.button}
          onClick={() => handlePageClick(selectedPage + 1)}
          disabled={selectedPage === pagesCount - 1}
          aria-label={displayNextLabel}
        >
          <span>{displayNextLabel}</span>
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  );
}
