'use client';
import { useCallback } from 'react';

export function SwatchGroup({ title, colors }: { title: string; colors: Array<{ value: string; name: string }> }) {
  const copyToClipboard = useCallback(async (color: string) => {
    try {
      await navigator.clipboard.writeText(color);
      alert('Color copied to clipboard!');
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  }, []);

  return (
    <div>
      <h2 className="mb-4 text-xl font-semibold">{title}</h2>
      <div className="grid grid-cols-6 gap-2 md:grid-cols-12">
        {colors.map((color) => (
          <button
            className="group h-16 w-full rounded-lg transition-transform hover:scale-105"
            key={color.name}
            onClick={() => copyToClipboard(color.value)}
            style={{ backgroundColor: color.value }}
          >
            <span className="absolute bottom-1 left-1 rounded bg-black/80 px-1.5 py-0.5 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 whitespace-nowrap z-10">
              {color.value}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
}
