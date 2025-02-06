'use client';
import { SwatchGroup } from '@/components/swatch-group';
import { ColorControls } from '@/components/color-controls';
import { useTranslations } from 'next-intl'; // 假設使用 next-intl 作為 i18n 方案



export default function PaletteGenerator() {
  const t = useTranslations('PaletteGenerator');

  return (
    <main
      className="container mx-auto p-4"
      style={{ color: 'oklch(var(--base-l) var(--base-c) var(--base-h))' }}
    >
      <div className="mb-8 space-y-4">
        <ColorControls t={t} />
      </div>

      <div className="space-y-12">
        <SwatchGroup
          colors={generateHueSwatch(12)}
          title={t('hueSwatch')}
        />
        <SwatchGroup
          colors={generateLightnessSwatch(12)}
          title={t('lightnessSwatch')}
        />
        <SwatchGroup
          colors={generateChromaSwatch(12)}
          title={t('chromaSwatch')}
        />
        <SwatchGroup
          colors={generateAnalogous()}
          title={t('analogous')}
        />
        <SwatchGroup
          colors={generateTriadic()}
          title={t('triadic')}
        />
      </div>
    </main>
  );
}

// 使用 CSS 變數的顏色生成函數
function generateLightnessSwatch(count: number) {
  return Array.from({ length: count }).map((_, i) => ({
    value: `oklch(from currentColor ${1 - i / (count - 1)} c h)`,
    name: `lightness-${i}`,
  }));
}

function generateAnalogous() {
  const hues = [
    'calc(h + 30)',    // +30度
    'h',            // 基準色相
    'calc(h - 30)'     // -30度
  ];
  const lightnesses = [0.8, 0.6, 0.4, 0.2]; // 20%, 40%, 60%, 80% 亮度

  return hues.flatMap((hue, hueIndex) =>
    lightnesses.map((lightness, lightnessIndex) => ({
      value: `oklch(from currentColor ${lightness}  c ${hue})`,
      name: `analogous-${hueIndex}-${lightnessIndex}`,
    }))
  );
}

function generateTriadic() {
  const hues = [
    'calc(h + 120)',
    'h',
    'calc(h - 120)'
  ];
  const lightnesses = [0.8, 0.6, 0.4, 0.2];

  return hues.flatMap((hue, hueIndex) =>
    lightnesses.map((lightness, lightnessIndex) => ({
      value: `oklch(from currentColor ${lightness} c ${hue})`,
      name: `triadic-${hueIndex}-${lightnessIndex}`,
    }))
  );
}

function generateHueSwatch(count: number) {
  return Array.from({ length: count }).map((_, i) => ({
    value: `oklch(from currentColor l c calc(h + ${i * 30}))`,
    name: `hue-${i}`,
  }));
}

function generateChromaSwatch(count: number) {
  return Array.from({ length: count }).map((_, i) => ({
    value: `oklch(from currentColor l calc(${(count - i) / (count - 1)} * c) h)`,
    name: `chromatic-${i}`,
  }));
}
