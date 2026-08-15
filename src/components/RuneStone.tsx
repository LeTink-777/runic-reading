import RuneGlyph from "./RuneGlyph";

interface RuneStoneProps {
  runeId?: string;
  size?: number;
  lit?: boolean;
  faceDown?: boolean;
  label?: string;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * A carved stone disc. The granite surface is pure CSS (layered radial
 * gradients plus inset shadows); the rune itself is vector strokes.
 */
export default function RuneStone({
  runeId,
  size = 120,
  lit = false,
  faceDown = false,
  label,
  className = "",
  style,
}: RuneStoneProps) {
  const classes = [
    "rune-stone",
    lit ? "is-lit" : "",
    faceDown ? "is-back" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div
      className={classes}
      style={{ width: size, height: size, ...style }}
      role={label ? "img" : undefined}
      aria-label={label}
    >
      {faceDown ? (
        <span
          className="font-display"
          style={{
            fontSize: size * 0.34,
            color: "var(--accent-amber)",
            opacity: 0.85,
          }}
        >
          ?
        </span>
      ) : runeId ? (
        <RuneGlyph
          id={runeId}
          size={size * 0.46}
          color={lit ? "var(--accent-amber-light)" : "var(--accent-amber)"}
          strokeWidth={1.15}
          style={
            lit
              ? { filter: "drop-shadow(0 0 8px rgba(232,130,12,0.75))" }
              : { filter: "drop-shadow(0 0 4px rgba(232,130,12,0.4))" }
          }
        />
      ) : null}
    </div>
  );
}
