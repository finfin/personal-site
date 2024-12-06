'use client'

import Image from 'next/image';
export function Wave() {


  return (
    <section className="absolute top-16 left-0 w-full h-96 -z-10" id="home">
      <Image
        alt="Dark hero background"
        className="object-cover -z-10 static hidden dark:block"
        fill
        priority
        src={'/image/dark-hero-background.svg'}
      />
      <Image
        alt="Light hero background"
        className="object-cover -z-10 static block dark:hidden"
        fill
        priority
        src={'/image/light-hero-background.svg'}
      />
    </section>
  );
}
