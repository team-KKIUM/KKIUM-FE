import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

export interface ApplyTextProps {
  title: string;
  items: readonly string[];
  highlightKeywords?: readonly string[];
  className?: string;
}

function escapeRegExp(value: string) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function buildHighlightPattern(keywords: readonly string[]) {
  const escaped = keywords
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .sort((a, b) => b.length - a.length)
    .map((keyword) => escapeRegExp(keyword));

  if (escaped.length === 0) {
    return null;
  }

  return new RegExp(`(${escaped.join('|')})`, 'gi');
}

function renderHighlightedText(text: string, keywords: readonly string[]): ReactNode {
  const pattern = buildHighlightPattern(keywords);

  if (!pattern) {
    return text;
  }

  const parts = text.split(pattern).filter(Boolean);

  return parts.map((part, index) => {
    const isKeyword = keywords.some(
      (keyword) => keyword.trim().toLowerCase() === part.trim().toLowerCase(),
    );

    if (!isKeyword) {
      return <span key={`${part}-${index}`}>{part}</span>;
    }

    return (
      <span key={`${part}-${index}`} className="text-success font-bold">
        {part}
      </span>
    );
  });
}

export function ApplyText({ title, items, highlightKeywords = [], className }: ApplyTextProps) {
  return (
    <section className={cn('flex w-full flex-col gap-3', className)}>
      <h2 className="title-2-bold text-gray-900">{title}</h2>

      <ul className="flex w-full flex-col gap-2">
        {items.map((item, index) => (
          <li key={`${index}-${item}`} className="body-3-regular text-gray-700">
            <span className="body-3-bold">✓ </span>
            {renderHighlightedText(item, highlightKeywords)}
          </li>
        ))}
      </ul>
    </section>
  );
}
