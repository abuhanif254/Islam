import React from 'react';

export interface IslamicGeometricEmblemProps {
  size?: number;
  primaryColor?: string;
  accentColor?: string;
  surfaceColor?: string;
}

export function IslamicGeometricEmblem({
  size = 44,
  primaryColor = '#0B4F3B',
  accentColor = '#B85D19',
  surfaceColor = '#FAF8F5'
}: IslamicGeometricEmblemProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="ইসলামিক জ্যামিতিক প্রতীক"
      className="shrink-0"
    >
      <rect
        x="10"
        y="10"
        width="44"
        height="44"
        fill={primaryColor}
        stroke={accentColor}
        strokeWidth="2"
      />
      <rect
        x="10"
        y="10"
        width="44"
        height="44"
        transform="rotate(45 32 32)"
        fill={primaryColor}
        stroke={accentColor}
        strokeWidth="2"
      />
      <rect
        x="19"
        y="19"
        width="26"
        height="26"
        fill={surfaceColor}
        stroke={accentColor}
        strokeWidth="1.5"
      />
      <rect
        x="19"
        y="19"
        width="26"
        height="26"
        transform="rotate(45 32 32)"
        fill={surfaceColor}
        stroke={accentColor}
        strokeWidth="1.5"
      />
      <circle cx="32" cy="32" r="8" fill={primaryColor} />
      <circle cx="32" cy="32" r="3.5" fill={accentColor} />
    </svg>
  );
}

export default IslamicGeometricEmblem;
