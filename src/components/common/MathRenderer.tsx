'use client';

import React from 'react';
import katex from 'katex';

interface MathRendererProps {
  content: string;
  className?: string;
}

export const MathRenderer: React.FC<MathRendererProps> = ({ content, className = '' }) => {
  // Parse inline ($...$) and display ($$...$$) math
  const renderMathContent = (text: string) => {
    // Split by display math $$...$$
    const displayParts = text.split(/(\$\$[\s\S]*?\$\$)/g);

    return displayParts.map((part, dIdx) => {
      if (part.startsWith('$$') && part.endsWith('$$')) {
        const math = part.slice(2, -2).trim();
        try {
          const html = katex.renderToString(math, {
            displayMode: true,
            throwOnError: false,
          });
          return (
            <span
              key={`d-${dIdx}`}
              className="my-3 block overflow-x-auto text-center"
              dangerouslySetInnerHTML={{ __html: html }}
            />
          );
        } catch {
          return <span key={`d-${dIdx}`}>{part}</span>;
        }
      }

      // Inside normal text, split by inline math $...$
      const inlineParts = part.split(/(\$[^\$\n]+?\$)/g);
      return (
        <span key={`p-${dIdx}`}>
          {inlineParts.map((subPart, iIdx) => {
            if (subPart.startsWith('$') && subPart.endsWith('$')) {
              const math = subPart.slice(1, -1).trim();
              try {
                const html = katex.renderToString(math, {
                  displayMode: false,
                  throwOnError: false,
                });
                return (
                  <span
                    key={`i-${iIdx}`}
                    className="inline-math px-0.5"
                    dangerouslySetInnerHTML={{ __html: html }}
                  />
                );
              } catch {
                return <span key={`i-${iIdx}`}>{subPart}</span>;
              }
            }
            return <span key={`i-${iIdx}`}>{subPart}</span>;
          })}
        </span>
      );
    });
  };

  return <div className={`math-rendered-text ${className}`}>{renderMathContent(content)}</div>;
};

