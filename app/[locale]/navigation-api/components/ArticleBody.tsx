import { Highlight, themes } from 'prism-react-renderer';

interface ArticleBodyProps {
  content: string;
}

interface TextSegment {
  type: 'text';
  content: string;
}

interface CodeSegment {
  type: 'code';
  lang: string;
  content: string;
}

type Segment = CodeSegment | TextSegment;

/**
 * Parse article body text, splitting on triple-backtick fenced code blocks.
 * Supports ```lang ... ``` format.
 */
function parseSegments(raw: string): Segment[] {
  const segments: Segment[] = [];
  const fenceRegex = /```(\w*)\n([\s\S]*?)```/g;
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = fenceRegex.exec(raw)) !== null) {
    // Text before the code block
    if (match.index > lastIndex) {
      segments.push({ type: 'text', content: raw.slice(lastIndex, match.index) });
    }
    segments.push({
      type: 'code',
      lang: match[1] || 'javascript',
      content: match[2].replace(/\n$/, ''), // trim trailing newline
    });
    lastIndex = match.index + match[0].length;
  }

  // Remaining text after last code block
  if (lastIndex < raw.length) {
    segments.push({ type: 'text', content: raw.slice(lastIndex) });
  }

  return segments;
}

export default function ArticleBody({ content }: ArticleBodyProps) {
  const segments = parseSegments(content);

  return (
    <div className="text-sm leading-relaxed text-muted-foreground space-y-3">
      {segments.map((seg, i) => {
        if (seg.type === 'text') {
          return (
            <div className="whitespace-pre-line" key={i}>
              {seg.content.trim()}
            </div>
          );
        }

        return (
          <Highlight
            code={seg.content}
            key={i}
            language={seg.lang}
            theme={themes.vsDark}
          >
            {({ className, style, tokens, getLineProps, getTokenProps }) => (
              <pre
                className={`${className} rounded-lg p-4 overflow-x-auto text-xs`}
                style={style}
              >
                <code>
                  {tokens.map((line, li) => (
                    <span key={li} {...getLineProps({ line })}>
                      {line.map((token, ti) => (
                        <span key={ti} {...getTokenProps({ token })} />
                      ))}
                      {li < tokens.length - 1 ? '\n' : null}
                    </span>
                  ))}
                </code>
              </pre>
            )}
          </Highlight>
        );
      })}
    </div>
  );
}
