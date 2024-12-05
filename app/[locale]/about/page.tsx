// import { getPaginatedPosts } from './blog/utils';
// import Pagination from '../components/Pagination';
import {getTranslations} from 'next-intl/server';

export default async function Home() {
  // const { posts, totalPages, currentPage } = getPaginatedPosts(1);
  const t = await getTranslations();

  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold">
        {t('about.title')}
      </h1>

      {t('about.description').split('\n').map((line, index) => (
        <p className="mb-4" key={index}>{line}</p>))
      }

      <h2 className="my-6 text-xl font-semibold">What I Do</h2>
      <ul className="mb-4 list-disc list-inside">
        <li><strong>Frontend Development</strong>: Crafting high-performance, modular, and maintainable interfaces, with deep expertise in React and CSS optimization.</li>
        <li><strong>Product Strategy</strong>: Using data-driven insights and UX research to develop impactful features and enhance user experiences.</li>
        <li><strong>Team Leadership</strong>: Building and scaling technical teams, streamlining workflows, and fostering continuous improvement.  </li>
      </ul>
      <p className="mb-4">
        This website showcases my journey, skills, and contributions to the tech and product development fields. If you&apos;re interested in collaborating, let&apos;s have a chat!
      </p>
    </section>


  )
}
