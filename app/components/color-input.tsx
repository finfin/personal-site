'use client';
import { useEffect, useState } from 'react';

export function ColorInput({ value, onChange }: { value: string; onChange: (color: string) => void }) {
  const [inputValue, setInputValue] = useState(value);

  useEffect(() => {
    setInputValue(value);
  }, [value]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setInputValue(newValue);
    if (isValidHex(newValue)) {
      onChange(newValue);
    }
  };

  const isValidHex = (color: string) => /^#([A-Fa-f0-9]{3,4}){1,2}$/.test(color);

  return (
    <div className="flex items-center gap-2">
      <input
        className="h-12 w-24 cursor-pointer rounded border-none"
        onChange={handleChange}
        type="color"
        value={value}
      />
      <input
        className="h-10 rounded border px-3 font-mono"
        onChange={handleChange}
        placeholder="#RRGGBB"
        type="text"
        value={inputValue}
      />
    </div>
  );
}
