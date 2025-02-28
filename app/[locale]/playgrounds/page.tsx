import React from 'react';
import Link from 'next/link';

const PlaygroundsPage = () => {
  return (
    <div>
      <h1>Playgrounds</h1>
      <ul>
        <li>
          <Link href="/playgrounds/ufo-catcher">UFO Catcher Game</Link>
        </li>
      </ul>
    </div>
  );
};

export default PlaygroundsPage;
