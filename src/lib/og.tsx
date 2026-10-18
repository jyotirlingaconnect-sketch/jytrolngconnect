import { readFile } from "node:fs/promises";
import { join } from "node:path";
import type { ImageResponse } from "next/og";

type OgFonts = NonNullable<ConstructorParameters<typeof ImageResponse>[1]>["fonts"];

export const ogSize = { width: 1200, height: 630 };

const colors = {
  bg: "#2A1B10",
  surface: "#3A2617",
  ink: "#FDF3E7",
  inkMuted: "#D3B89D",
  accent: "#E2582D",
  gold: "#D4AF6A",
};

const siteHost = new URL(
  process.env.NEXT_PUBLIC_SITE_URL || "https://www.jyotirlingconnect.com"
).host;

export async function loadOgFonts(): Promise<OgFonts> {
  const furonto = await readFile(
    join(process.cwd(), "public/fonts/FurontoRegular.otf")
  );
  return [{ name: "Furonto", data: furonto, style: "normal", weight: 400 }];
}

type OgCardProps = {
  eyebrow: string;
  title: string;
  subtitle: string;
  badge?: string;
};

export function OgCard({ eyebrow, title, subtitle, badge }: OgCardProps) {
  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        padding: "72px 80px",
        background: `radial-gradient(circle at 85% 15%, ${colors.surface} 0%, ${colors.bg} 60%)`,
        color: colors.ink,
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{ width: 48, height: 4, background: colors.accent }} />
        <div
          style={{
            fontSize: 26,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: colors.gold,
          }}
        >
          {eyebrow}
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
        <div
          style={{
            fontFamily: "Furonto",
            fontSize: title.length > 32 ? 76 : 96,
            lineHeight: 1.05,
            maxWidth: 1000,
          }}
        >
          {title}
        </div>
        <div style={{ fontSize: 32, color: colors.inkMuted, maxWidth: 940 }}>
          {subtitle}
        </div>
      </div>

      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ fontSize: 28, color: colors.inkMuted }}>{siteHost}</div>
        {badge && (
          <div
            style={{
              display: "flex",
              padding: "14px 32px",
              borderRadius: 999,
              background: colors.accent,
              color: colors.ink,
              fontSize: 32,
            }}
          >
            {badge}
          </div>
        )}
      </div>
    </div>
  );
}
