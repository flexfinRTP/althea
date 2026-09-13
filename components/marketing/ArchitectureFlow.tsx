const olive = "#5c5c38";
const ink = "#2c2b1f";
const elev = "#f8f3e6";
const cream = "#f3eddd";

function Pill({
  x,
  y,
  w,
  h,
  label,
  fill = elev,
  color = ink,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  label: string;
  fill?: string;
  color?: string;
}) {
  return (
    <g>
      <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={fill} stroke={olive} strokeWidth={1.15} />
      <text
        x={x + w / 2}
        y={y + h / 2 + 1}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={color}
        fontSize={14}
        fontWeight={500}
      >
        {label}
      </text>
    </g>
  );
}

function Arrow({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={olive}
      strokeWidth={1.15}
      markerEnd="url(#how-arrow)"
    />
  );
}

function Stem({ x1, y1, x2, y2 }: { x1: number; y1: number; x2: number; y2: number }) {
  return <line x1={x1} y1={y1} x2={x2} y2={y2} stroke={olive} strokeWidth={1.15} />;
}

export function ArchitectureFlow({ className = "" }: { className?: string }) {
  const c = 420;
  const w = 228;
  const h = 40;
  const x = c - w / 2;
  const left = 90;
  const right = 522;
  const colW = 228;

  return (
    <svg
      viewBox="0 0 840 1024"
      role="img"
      className={className}
      fontFamily="var(--font-althea), 'Plus Jakarta Sans', ui-sans-serif, system-ui, sans-serif"
    >
      <title>Althea architecture</title>
      <desc>
        Patient App to Althea API, then FAP Intelligence and Case Workflow, merging at Hospital
        Decision and Residual Balance, then Althea Relief through World Check, Relief Rules, Circle
        Agent, Privy, Arc USDC, and Provider Settlement.
      </desc>
      <defs>
        <marker
          id="how-arrow"
          viewBox="0 0 10 10"
          refX="8.2"
          refY="5"
          markerWidth="7"
          markerHeight="7"
          orient="auto"
        >
          <path d="M 0 1.2 L 9 5 L 0 8.8 Z" fill={olive} />
        </marker>
      </defs>
      <rect width="840" height="1024" fill={cream} />

      <text
        x={c}
        y={36}
        textAnchor="middle"
        fill={olive}
        fontSize={13}
        fontWeight={600}
        letterSpacing="0.32em"
      >
        ALTHEA
      </text>

      <Pill x={x} y={56} w={w} h={h} label="Patient App" />
      <Arrow x1={c} y1={96} x2={c} y2={124} />
      <Pill x={x} y={128} w={w} h={h} label="Althea API" />

      <Stem x1={c} y1={168} x2={c} y2={188} />
      <Stem x1={left + colW / 2} y1={188} x2={right + colW / 2} y2={188} />
      <Arrow x1={left + colW / 2} y1={188} x2={left + colW / 2} y2={214} />
      <Arrow x1={right + colW / 2} y1={188} x2={right + colW / 2} y2={268} />

      <rect
        x={left - 16}
        y={218}
        width={colW + 32}
        height={176}
        rx={18}
        fill={elev}
        stroke={olive}
        strokeWidth={1.15}
      />
      <text
        x={left + colW / 2}
        y={246}
        textAnchor="middle"
        fill={ink}
        fontSize={14}
        fontWeight={600}
      >
        FAP Intelligence
      </text>
      <Pill x={left} y={262} w={colW} h={32} label="Extract" />
      <Pill x={left} y={304} w={colW} h={32} label="Rules" />
      <Pill x={left} y={346} w={colW} h={32} label="Engine" />
      <Pill x={right} y={272} w={colW} h={56} label="Case Workflow" />

      <Stem x1={left + colW / 2} y1={394} x2={left + colW / 2} y2={416} />
      <Stem x1={right + colW / 2} y1={328} x2={right + colW / 2} y2={416} />
      <Stem x1={left + colW / 2} y1={416} x2={right + colW / 2} y2={416} />
      <Arrow x1={c} y1={416} x2={c} y2={440} />

      <Pill x={x} y={444} w={w} h={h} label="Hospital Decision" />
      <Arrow x1={c} y1={484} x2={c} y2={508} />
      <Pill x={x} y={512} w={w} h={h} label="Residual Balance" />
      <Arrow x1={c} y1={552} x2={c} y2={576} />

      <rect x={c - 170} y={580} width={340} height={40} rx={20} fill={olive} />
      <text
        x={c}
        y={602}
        textAnchor="middle"
        dominantBaseline="middle"
        fill={cream}
        fontSize={13}
        fontWeight={600}
        letterSpacing="0.22em"
      >
        ALTHEA RELIEF
      </text>

      <Arrow x1={c} y1={620} x2={c} y2={648} />
      <Pill x={x} y={652} w={w} h={h} label="World Check" />
      <Arrow x1={c} y1={692} x2={c} y2={716} />
      <Pill x={x} y={720} w={w} h={h} label="Relief Rules" />
      <Arrow x1={c} y1={760} x2={c} y2={784} />
      <Pill x={x} y={788} w={w} h={h} label="Circle Agent" />

      <Stem x1={c} y1={828} x2={c} y2={848} />
      <Stem x1={left + colW / 2} y1={848} x2={right + colW / 2} y2={848} />
      <Arrow x1={left + colW / 2} y1={848} x2={left + colW / 2} y2={872} />
      <Arrow x1={right + colW / 2} y1={848} x2={right + colW / 2} y2={872} />
      <Pill x={left} y={876} w={colW} h={h} label="Privy" />
      <Pill x={right} y={876} w={colW} h={h} label="Arc USDC" />

      <Stem x1={left + colW / 2} y1={916} x2={left + colW / 2} y2={936} />
      <Stem x1={right + colW / 2} y1={916} x2={right + colW / 2} y2={936} />
      <Stem x1={left + colW / 2} y1={936} x2={right + colW / 2} y2={936} />
      <Arrow x1={c} y1={936} x2={c} y2={956} />
      <Pill x={x} y={960} w={w} h={h} label="Provider Settlement" />
    </svg>
  );
}
