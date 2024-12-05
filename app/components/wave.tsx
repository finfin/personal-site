'use client'

import Image from 'next/image';
import { useTheme } from '../provider/theme-provider';
export function Wave() {
  const { currentTheme } = useTheme();


  return (
    <section className="absolute top-16 left-0 w-full h-96 -z-10" id="home">
      <Image
        alt="Hero background"
        className="object-cover -z-10 static"
        fill
        priority
        src={`/image/${currentTheme}-hero-background.svg`}
      />

    </section>
  );
}
