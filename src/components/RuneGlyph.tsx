import { RUNE_GLYPHS, strokeToPoints } from "@/lib/runeGlyphs";

interface RuneGlyphProps {
  id: string;
  size?: number;
  color?: string;
  strokeWidth?: number;
  title?: string;
  className?: string;
  style?: React.CSSProperties;
}

/** A single Elder Futhark rune drawn as vector strokes. */
export default function RuneGlyph({
  id,
  size = 48,
  color = "var(--accent-amber)",
  strokeWidth = 1.1,
  title,
  className,
  style,
}: RuneGlyphProps) {
  const strokes = RUNE_GLYPHS[id];
  if (!strokes) return null;

  return (
    <svg
      viewBox="0 0 10 21"
      width={size * (10 / 21)}
      height={size}
      className={className}
      style={style}
      role={title ? "img" : "presentation"}
      aria-label={title}
      aria-hidden={title ? undefined : true}
      overflow="visible"
    >
      {title ? <title>{title}</title> : null}
      {strokes.map((stroke, i) => (
        <polyline
          key={i}
          points={strokeToPoints(stroke)}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      ))}
    </svg>
  );
}
