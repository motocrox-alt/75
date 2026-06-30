"use client";

// Radar de los 6 stats (Recharts), estilo NES: trazo grueso --ink, relleno
// --coin translúcido, labels cortos en Silkscreen. Nada de gradientes/sombras.
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
} from "recharts";
import { STATS_META, STAT_MAX } from "@/config/stats";
import type { Stats } from "@/lib/schemas";

interface TickProps {
  x?: number;
  y?: number;
  textAnchor?: "start" | "middle" | "end" | "inherit";
  payload?: { value?: string };
}

function NesTick({ x = 0, y = 0, textAnchor, payload }: TickProps) {
  return (
    <text
      x={x}
      y={y}
      textAnchor={textAnchor}
      dominantBaseline="central"
      className="font-silk"
      fill="#201A10"
      fontSize={9}
    >
      {payload?.value}
    </text>
  );
}

export function StatRadar({ stats }: { stats: Stats }) {
  const data = STATS_META.map((m) => ({ stat: m.label, value: stats[m.id] }));
  return (
    <div className="h-60 w-full">
      <ResponsiveContainer width="100%" height="100%">
        <RadarChart data={data} outerRadius="70%">
          <PolarGrid stroke="#201A10" strokeWidth={1} />
          <PolarAngleAxis dataKey="stat" tick={<NesTick />} />
          <PolarRadiusAxis domain={[0, STAT_MAX]} tick={false} axisLine={false} />
          <Radar
            dataKey="value"
            stroke="#201A10"
            strokeWidth={3}
            fill="#FBD000"
            fillOpacity={0.55}
            isAnimationActive={false}
          />
        </RadarChart>
      </ResponsiveContainer>
    </div>
  );
}
