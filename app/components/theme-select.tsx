'use client'
import { useTheme } from '../provider/theme-provider';

export function ThemeSelect() {
  const { theme, setTheme } = useTheme();


  return (
    <select
      onChange={(e) => setTheme(e.target.value)}
      value={theme}
    >
      <option value="auto">Auto</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
}
