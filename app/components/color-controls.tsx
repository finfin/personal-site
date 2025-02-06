'use client';
import { useCallback, useEffect, useState } from 'react';

interface OKLCHColor {
  l: number;
  c: number;
  h: number;
}

interface ColorControlsProps {
  t: (key: string) => string;
}

// 提取為頂層函數
function updateCSSVariable(name: string, value: string | number) {
  document.documentElement.style.setProperty(`--${name}`, value.toString());
}
const MAX_CHROMA = 0.3;
export function ColorControls({ t }: ColorControlsProps) {
  const [oklch, setOklch] = useState<OKLCHColor>({
    l: 0.7993,
    c: 0.0902,
    h: 59.91,
  });
  const [maxChroma] = useState(MAX_CHROMA);

  const handleOklchChange = useCallback((key: keyof OKLCHColor, value: number) => {
    setOklch(prev => {
      const newColor = { ...prev, [key]: value };
      updateCSSVariable(`base-${key}`, value);
      return newColor;
    });
  }, []);

  // 初始化 CSS 變數
  useEffect(() => {
    const { l, c, h } = oklch;
    updateCSSVariable('base-l', l);
    updateCSSVariable('base-c', c);
    updateCSSVariable('base-h', h);
    updateCSSVariable('hue-distance', 30);
    updateCSSVariable('palette-size', 12);
  }, [oklch]);

  const baseColor = `oklch(${oklch.l} ${oklch.c} ${oklch.h})`;

  return (
    <>
      <div className="flex items-center justify-center rounded border h-20"
        style={{ backgroundColor: baseColor }}
      >
        <span className="text-md font-mono px-1 py-0.5 rounded bg-white/40 text-black/80">
          {baseColor}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <div className="space-y-2">
          <label className="block text-sm">{t('lightness')}</label>
          <input
            className="w-full"
            max="1"
            min="0"
            onChange={(e) => handleOklchChange('l', Number(e.target.value))}
            step="0.01"
            type="range"
            value={oklch.l}
          />
          <span className="text-sm">{(oklch.l * 100).toFixed(2)}%</span>
        </div>
        <div className="space-y-2">
          <label className="block text-sm">
            {t('chroma')} (Max: {maxChroma.toFixed(4)})
          </label>
          <input
            className="w-full"
            max={maxChroma}
            min="0"
            onChange={(e) => handleOklchChange('c', Number(e.target.value))}
            step="0.001"
            type="range"
            value={oklch.c}
          />
          <span className="text-sm">{oklch.c.toFixed(4)}</span>
        </div>
        <div className="space-y-2">
          <label className="block text-sm">{t('hue')}</label>
          <input
            className="w-full"
            max="360"
            min="0"
            onChange={(e) => handleOklchChange('h', Number(e.target.value))}
            step="0.1"
            type="range"
            value={oklch.h}
          />
          <span className="text-sm">{oklch.h.toFixed(2)}°</span>
        </div>
      </div>
    </>
  );
}
