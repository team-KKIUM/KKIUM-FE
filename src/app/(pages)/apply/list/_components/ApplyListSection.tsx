'use client';

import * as React from 'react';

import type { ApplyListItem } from '../_constants/applyListMockData';
import { ApplyCard } from './ApplyCard';
import { ApplyDetailSidebar } from './ApplyDetailSidebar';

export interface ApplyListSectionProps {
  cards: ApplyListItem[];
}

export function ApplyListSection({ cards }: ApplyListSectionProps) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [activeId, setActiveId] = React.useState<string | null>(null);
  const closeTimerRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  React.useEffect(() => {
    return () => {
      if (closeTimerRef.current) {
        clearTimeout(closeTimerRef.current);
      }
    };
  }, []);

  const activeItem = React.useMemo(
    () => cards.find((card) => card.id === activeId) ?? null,
    [cards, activeId],
  );

  function handleClose() {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
    }
    setSidebarOpen(false);
    closeTimerRef.current = setTimeout(() => {
      setActiveId(null);
      closeTimerRef.current = null;
    }, 300);
  }

  function handleCardOpen(cardId: string) {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
    setActiveId(cardId);
    setSidebarOpen(true);
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-5">
        {cards.map((card) => (
          <ApplyCard
            key={card.id}
            applyTitle={card.title}
            companyName={card.companyName}
            jobField={card.jobField}
            period={card.period}
            selected={sidebarOpen && activeId === card.id}
            onCardClick={() => handleCardOpen(card.id)}
            className="max-w-none"
          />
        ))}
      </div>

      <ApplyDetailSidebar open={sidebarOpen} item={activeItem} onClose={handleClose} />
    </>
  );
}
