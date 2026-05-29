import type { CSSProperties } from 'react';

import { buildNameCompatibilityRows } from '@/app/_utils/calculateNameCompatibility';
import { cn } from '@/lib/utils';

interface NameCompatibilityAnimationProps {
  name: string;
  company: string;
  score: number;
}

export function NameCompatibilityAnimation({ name, company, score }: NameCompatibilityAnimationProps) {
  const rows = buildNameCompatibilityRows(name, company, score);
  const previewRows = rows.numberRows.slice(0, -1);
  const scoreRow = rows.numberRows.at(-1) ?? [0, 0];

  return (
    <div
      data-compat-root
      role="img"
      className="relative flex w-full max-w-[390px] flex-col items-center"
      aria-label={`${name}와 ${company}의 합격 궁합 ${score}%`}
    >
      <style>
        {`
          @keyframes compatibility-row-drop {
            0% {
              opacity: 0;
              transform: translateY(-20px) scale(0.96);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes compatibility-score-pop {
            0% {
              opacity: 0;
              transform: translateY(-22px) scale(0.82);
            }
            72% {
              opacity: 1;
              transform: translateY(3px) scale(1.04);
            }
            100% {
              opacity: 1;
              transform: translateY(0) scale(1);
            }
          }

          @keyframes compatibility-line-down {
            0% {
              opacity: 0;
              transform: scaleY(0) translateY(-4px);
            }
            100% {
              opacity: 1;
              transform: scaleY(1) translateY(0);
            }
          }

          @keyframes compatibility-line-across {
            0% {
              opacity: 0;
              transform: scaleX(0);
            }
            100% {
              opacity: 1;
              transform: scaleX(1);
            }
          }
        `}
      </style>

      <div
        aria-hidden="true"
        className="flex w-full flex-col items-center [--compat-cell-size:clamp(36px,10.3vw,48px)]"
      >
        <ValueRow
          values={rows.characters}
          delay={0}
          className="text-[clamp(12px,3.5vw,15px)] font-bold"
        />

        {previewRows.map((row, rowIndex) => {
          const upperCount = rowIndex === 0 ? rows.characters.length : previewRows[rowIndex - 1].length;
          const rowDelay = 210 + rowIndex * 260;

          return (
            <div key={`row-${rowIndex}-${row.join('')}`} className="flex flex-col items-center">
              <CompatibilityConnector upperCount={upperCount} delay={80 + rowIndex * 260} />
              <ValueRow
                values={row}
                delay={rowDelay}
                className="text-[clamp(13px,3.8vw,16px)] font-normal"
              />
            </div>
          );
        })}

        <CompatibilityConnector
          upperCount={previewRows.at(-1)?.length ?? rows.characters.length}
          delay={80 + previewRows.length * 260}
        />
        <ScoreRow
          scoreDigits={scoreRow.join('')}
          delay={210 + previewRows.length * 260}
        />
      </div>
    </div>
  );
}

interface ValueRowProps {
  values: Array<string | number>;
  delay: number;
  className?: string;
}

function ValueRow({
  values,
  delay,
  className,
}: ValueRowProps) {
  return (
    <div
      className={cn(
        'grid items-baseline justify-center leading-none text-strong [animation-delay:var(--compat-delay)]',
        'animate-[compatibility-row-drop_360ms_cubic-bezier(0.16,1,0.3,1)_both]',
        className,
      )}
      style={getRowStyle(values.length, delay)}
    >
      {values.map((value, index) => (
        <span key={`${value}-${index}`} className="text-center">
          {value}
        </span>
      ))}
    </div>
  );
}

interface ScoreRowProps {
  scoreDigits: string;
  delay: number;
}

function ScoreRow({ scoreDigits, delay }: ScoreRowProps) {
  return (
    <div
      className="mt-[clamp(14px,2.7dvh,24px)] flex w-full justify-center animate-[compatibility-score-pop_520ms_cubic-bezier(0.16,1,0.3,1)_both] [animation-delay:var(--compat-delay)]"
      style={getAnimationDelayStyle(delay)}
    >
      <div data-compat-score className="inline-flex items-baseline justify-center text-strong">
        <span className="text-[clamp(72px,20vw,96px)] leading-none font-normal tracking-normal">
          {scoreDigits}
        </span>
        <span className="ml-[clamp(6px,1.8vw,8px)] text-[clamp(48px,13vw,62px)] leading-none font-normal tracking-normal">
          %
        </span>
      </div>
    </div>
  );
}

interface CompatibilityConnectorProps {
  upperCount: number;
  delay: number;
}

function CompatibilityConnector({ upperCount, delay }: CompatibilityConnectorProps) {
  if (upperCount < 2) {
    return null;
  }

  const lowerCount = upperCount - 1;

  return (
    <div
      data-compat-connector
      className="relative h-[clamp(22px,5vw,32px)]"
      style={getConnectorStyle(upperCount)}
      aria-hidden="true"
    >
      {Array.from({ length: upperCount }).map((_, index) => (
        <span
          key={`upper-${index}`}
          className="absolute top-0 h-[48%] border-l border-dashed border-black/80 animate-[compatibility-line-down_180ms_ease-out_both] [animation-delay:var(--compat-delay)] origin-top"
          style={getLinePositionStyle(index + 0.5, delay)}
        />
      ))}
      <span
        className="absolute left-[calc(var(--compat-cell-size)/2)] right-[calc(var(--compat-cell-size)/2)] top-[48%] border-t border-dashed border-black/80 animate-[compatibility-line-across_220ms_ease-out_both] [animation-delay:var(--compat-delay)] origin-[left]"
        style={getAnimationDelayStyle(delay + 110)}
      />
      {Array.from({ length: lowerCount }).map((_, index) => (
        <span
          key={`lower-${index}`}
          className="absolute top-[48%] h-[52%] border-l border-dashed border-black/80 animate-[compatibility-line-down_180ms_ease-out_both] [animation-delay:var(--compat-delay)] origin-top"
          style={getLinePositionStyle(index + 1, delay + 250)}
        />
      ))}
    </div>
  );
}

function getAnimationDelayStyle(delay: number) {
  return { '--compat-delay': `${delay}ms` } as CSSProperties;
}

function getRowStyle(valueCount: number, delay: number) {
  return {
    ...getAnimationDelayStyle(delay),
    gridTemplateColumns: `repeat(${valueCount}, var(--compat-cell-size))`,
  } as CSSProperties;
}

function getConnectorStyle(upperCount: number) {
  return {
    width: `calc(${upperCount} * var(--compat-cell-size))`,
  } as CSSProperties;
}

function getLinePositionStyle(cellPosition: number, delay: number) {
  return {
    ...getAnimationDelayStyle(delay),
    left: `calc(${cellPosition} * var(--compat-cell-size))`,
  } as CSSProperties;
}
