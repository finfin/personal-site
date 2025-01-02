import {
  BrandFacebook,
  BrandGithub,
  BrandThreads
} from '@mynaui/icons-react';
import { Coffee } from './coffee';
import { BrandBluesky } from './bluesky';
import { BrandLinkedin } from './linkedin';
import { ThemeSelect } from './theme-select'

function ArrowIcon() {
  return (
    <svg
      fill="none"
      height="12"
      viewBox="0 0 12 12"
      width="12"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M2.07102 11.3494L0.963068 10.2415L9.2017 1.98864H2.83807L2.85227 0.454545H11.8438V9.46023H10.2955L10.3097 3.09659L2.07102 11.3494Z"
        fill="currentColor"
      />
    </svg>
  )
}

export default function Footer() {
  return (
    <footer className="border-t border-neutral-200 dark:border-neutral-700 pt-4 my-4">
      <div className="mb-4 flex justify-between items-center">
        <ul className="font-sm flex flex-col space-x-0 space-y-2 text-neutral-600 md:flex-row md:space-x-4 md:space-y-0 dark:text-neutral-300">
          <li>
            <a
              className="flex items-center transition-all hover:text-neutral-800 dark:hover:text-neutral-100"
              href="/rss"
              rel="noopener noreferrer"
              target="_blank"
            >
              <ArrowIcon />
              <p className="ml-2 h-7">rss</p>
            </a>
          </li>
        </ul>
        <ThemeSelect />
      </div>

      <div className="flex flex-col-reverse md:flex-row justify-between items-center gap-4 md:gap-0">
        <div className="text-sm text-neutral-600 dark:text-neutral-300">
          <p>© 2024-present Things About Web Dev. All rights reserved.</p>
        </div>

        <div className="flex items-center gap-4">
          <a
            className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors"
            href="https://www.linkedin.com/in/rettamkrad/"
            rel="noopener noreferrer"
            target="_blank"
          >
            <BrandLinkedin size={20} />
          </a>
          <a
            className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors"
            href="https://www.facebook.com/thingsaboutwebdev"
            rel="noopener noreferrer"
            target="_blank"
          >
            <BrandFacebook size={20} />
          </a>
          <a
            className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors"
            href="https://github.com/finfin"
            rel="noopener noreferrer"
            target="_blank"
          >
            <BrandGithub size={20} />
          </a>
          <a
            className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors"
            href="https://www.threads.net/@thingsaboutwebdev"
            rel="noopener noreferrer"
            target="_blank"
          >
            <BrandThreads size={20} />
          </a>
          <a
            className="text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors"
            href="https://bsky.app/profile/thingaboutwebdev.bsky.social"
            rel="noopener noreferrer"
            target="_blank"
          >
            <BrandBluesky size="20" />
          </a>
          <a
            className="flex items-center text-neutral-600 hover:text-neutral-800 dark:text-neutral-300 dark:hover:text-neutral-100 transition-colors"
            href="https://www.buymeacoffee.com/finfin"
            rel="noopener noreferrer"
            target="_blank"
            title="Buy me a tea"
          >
            <Coffee size={20} />
            <span className="ml-2">Buy me a tea</span>
          </a>
        </div>
      </div>
    </footer>
  )
}
