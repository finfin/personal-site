'use client'
import { useTheme } from '../provider/theme-provider';

export function ThemeSelect() {
  const { theme, setTheme } = useTheme();

  return (
    <select
      value={theme}
      onChange={(e) => setTheme(e.target.value)}
      className="bg-white dark:bg-gray-800 text-black dark:text-white p-2 rounded border border-gray-300 dark:border-gray-600"
    >
      <option value="auto">Auto</option>
      <option value="light">Light</option>
      <option value="dark">Dark</option>
    </select>
  );
}
