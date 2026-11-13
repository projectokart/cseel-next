'use client';

import React from 'react';

interface EditorialMarkupRendererProps {
  content: string;
  className?: string;
}

/**
 * Renders inline formatting tokens within a paragraph, heading, or list item:
 * - ==highlight==  -> soft amber editorial highlight
 * - [Tag] / [[Tag]] or #TagWord -> compact inline pill badge
 * - **bold** -> crisp dark bold emphasis
 */
function renderInlineTokens(text: string, keyPrefix: string): React.ReactNode[] {
  const tokenRegex = /(==.+?==|\[\[?.+?\]\]?|\*\*[^*\n]+?\*\*|(?:^|\s)#[A-Za-z][A-Za-z0-9_-]{1,28}\b)/g;
  const nodes: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;
  let idx = 0;

  while ((match = tokenRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      nodes.push(text.slice(lastIndex, match.index));
    }

    const token = match[0];

    if (token.startsWith('==') && token.endsWith('==') && token.length > 4) {
      nodes.push(
        <mark
          key={`${keyPrefix}-hl-${idx}`}
          className="bg-[#FEF3C7] text-[#78350F] px-1.5 py-0.5 rounded font-semibold"
        >
          {token.slice(2, -2)}
        </mark>
      );
    } else if (token.startsWith('[[') && token.endsWith(']]') && token.length > 4) {
      nodes.push(
        <span
          key={`${keyPrefix}-tag2-${idx}`}
          className="inline-flex items-center px-2 py-0.5 mx-0.5 rounded-full text-[11px] font-bold bg-[#EDF5FA] text-[#006FCC] border border-[#D0E4F5] align-baseline"
        >
          {token.slice(2, -2).trim()}
        </span>
      );
    } else if (token.startsWith('[') && token.endsWith(']') && token.length > 2) {
      nodes.push(
        <span
          key={`${keyPrefix}-tag-${idx}`}
          className="inline-flex items-center px-2 py-0.5 mx-0.5 rounded-full text-[11px] font-bold bg-[#EDF5FA] text-[#006FCC] border border-[#D0E4F5] align-baseline"
        >
          {token.slice(1, -1).trim()}
        </span>
      );
    } else if (token.startsWith('**') && token.endsWith('**') && token.length > 4) {
      nodes.push(
        <strong key={`${keyPrefix}-b-${idx}`} className="font-semibold text-[#202124]">
          {token.slice(2, -2)}
        </strong>
      );
    } else {
      // Preserve optional leading space before #Tag
      const leadingSpace = token.startsWith(' ') ? ' ' : '';
      const tagLabel = token.trim().slice(1);
      if (leadingSpace) {
        nodes.push(leadingSpace);
      }
      nodes.push(
        <span
          key={`${keyPrefix}-hash-${idx}`}
          className="inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-bold bg-[#EDF5FA] text-[#006FCC] border border-[#D0E4F5] align-baseline"
        >
          {tagLabel}
        </span>
      );
    }

    lastIndex = tokenRegex.lastIndex;
    idx++;
  }

  if (lastIndex < text.length) {
    nodes.push(text.slice(lastIndex));
  }

  return nodes;
}

type Block =
  | { type: 'h1' | 'h2' | 'h3'; text: string }
  | { type: 'p'; text: string }
  | { type: 'ul'; items: string[] };

/**
 * Parses clean chapter-style editorial markup into structured reading blocks.
 * Supported markers (all stripped cleanly from public output):
 * - Heading:    `** Heading`, `**Heading**`, or `# Heading`
 * - Subheading: `## Subheading`, `### Subheading`, `*** Subheading`, `:: Subheading`
 * - Bullet:     `- Point` or `* Point`
 * - Inline:     `==highlight==`, `[Tag]`, `#Hashtag`, `**bold**`
 */
function parseEditorialBlocks(raw: string): Block[] {
  const lines = raw.replace(/\r\n/g, '\n').split('\n');
  const blocks: Block[] = [];
  let paragraphLines: string[] = [];
  let listItems: string[] = [];
  let seenHeading = false;

  const flushParagraph = () => {
    if (paragraphLines.length > 0) {
      blocks.push({ type: 'p', text: paragraphLines.join(' ').trim() });
      paragraphLines = [];
    }
  };

  const flushList = () => {
    if (listItems.length > 0) {
      blocks.push({ type: 'ul', items: [...listItems] });
      listItems = [];
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trim();

    if (!line) {
      flushParagraph();
      flushList();
      continue;
    }

    // Subheading markers first (***, ##, ###, ::, ^^)
    if (/^(?:\*{3,}|#{2,4}|::|\^\^)\s+/.test(line)) {
      flushParagraph();
      flushList();
      const cleaned = line.replace(/^(?:\*{3,}|#{2,4}|::|\^\^)\s+/, '').replace(/\*{2,}$/, '').trim();
      if (cleaned) {
        blocks.push({ type: 'h3', text: cleaned });
      }
      continue;
    }

    // Heading markers (`** Heading`, `**Heading**` as whole line, or `# Heading`)
    const doubleStarLineMatch = line.match(/^\*\*\s+(.+?)(?:\s*\*\*)?$/);
    const wrappedStarLineMatch = line.match(/^\*\*([^*\n]+?)\*\*$/);
    const singleHashMatch = line.match(/^#\s+(.+)$/);

    if (doubleStarLineMatch || wrappedStarLineMatch || singleHashMatch) {
      flushParagraph();
      flushList();
      const cleaned = (
        doubleStarLineMatch?.[1] ||
        wrappedStarLineMatch?.[1] ||
        singleHashMatch?.[1] ||
        ''
      ).trim();
      if (cleaned) {
        blocks.push({ type: seenHeading ? 'h2' : 'h1', text: cleaned });
        seenHeading = true;
      }
      continue;
    }

    // Bullet item (`- item` or `* item`)
    if (/^(?:-|•|\*)\s+/.test(line)) {
      flushParagraph();
      const cleaned = line.replace(/^(?:-|•|\*)\s+/, '').trim();
      if (cleaned) {
        listItems.push(cleaned);
      }
      continue;
    }

    flushList();
    paragraphLines.push(line);
  }

  flushParagraph();
  flushList();

  return blocks;
}

export default function EditorialMarkupRenderer({ content, className = '' }: EditorialMarkupRendererProps) {
  const blocks = React.useMemo(() => parseEditorialBlocks(content || ''), [content]);

  return (
    <article className={`font-['Lato',var(--font-roboto),Roboto,sans-serif] text-[#3C4043] leading-[1.68] ${className}`}>
      {blocks.map((block, idx) => {
        if (block.type === 'h1' || block.type === 'h2') {
          return (
            <div
              key={`blk-${idx}`}
              className={idx === 0 ? 'mt-1 mb-3' : 'mt-7 sm:mt-8 pt-6 border-t border-[#E8EAED] mb-3'}
            >
              <h3 className="!text-[18px] sm:!text-[20px] !font-bold font-['Montserrat',sans-serif] text-[#003C6E] tracking-tight leading-[1.32] pl-3 border-l-[3px] border-[#006FCC] m-0">
                {renderInlineTokens(block.text, `h-${idx}`)}
              </h3>
            </div>
          );
        }

        if (block.type === 'h3') {
          const prevIsSectionHeading = idx > 0 && (blocks[idx - 1]?.type === 'h1' || blocks[idx - 1]?.type === 'h2');
          return (
            <div
              key={`blk-${idx}`}
              className={
                prevIsSectionHeading
                  ? 'mt-3 mb-1.5'
                  : 'mt-5 pt-4 border-t border-slate-100 mb-1.5'
              }
            >
              <h4 className="text-[15px] sm:text-[17px] font-bold font-['Montserrat',sans-serif] text-[#006FCC] tracking-tight leading-[1.38] flex items-center gap-2 m-0">
                <span className="w-1.5 h-1.5 rounded-full bg-[#006FCC] shrink-0" />
                <span>{renderInlineTokens(block.text, `h3-${idx}`)}</span>
              </h4>
            </div>
          );
        }

        if (block.type === 'ul') {
          return (
            <ul key={`blk-${idx}`} className="my-3 space-y-2 pl-5 list-disc marker:text-[#006FCC]">
              {block.items.map((item, i) => (
                <li
                  key={`li-${idx}-${i}`}
                  className="!text-[15px] font-['Lato',var(--font-roboto),Roboto,sans-serif] text-[#3C4043] !leading-[1.68] font-normal pl-0.5"
                >
                  {renderInlineTokens(item, `li-${idx}-${i}`)}
                </li>
              ))}
            </ul>
          );
        }

        return (
          <p
            key={`blk-${idx}`}
            className="!text-[15px] font-['Lato',var(--font-roboto),Roboto,sans-serif] text-[#3C4043] !leading-[1.68] font-normal mb-3.5 last:mb-0"
          >
            {renderInlineTokens(block.text, `p-${idx}`)}
          </p>
        );
      })}
    </article>
  );
}
