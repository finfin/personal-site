import { getPaginatedPosts } from './blog/utils';
import { Posts } from '../components/posts';
import Pagination from '../components/Pagination';
import {getTranslations} from 'next-intl/server';
import {Link} from '@/i18n/routing';

export default async function Home({params: { lang }}) {
  const { posts, totalPages, currentPage } = getPaginatedPosts(1);

  const t = await getTranslations();

  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        {t('about.title')}
      </h1>
      {/* break dict.about.description line break into p element */
      /* dict.about.description is a string with line breaks */
      /* so we need to split it into an array of strings */
      /* and map each string to a p element */}
      {t('about.description').split('\n').map((line) => (
        <p className="mb-4">{line}</p>))
      }

      <h2 className="my-6 text-xl font-semibold tracking-tighter">What I Do</h2>
      <ul className="mb-4 list-disc list-inside">
        <li><strong>Frontend Development</strong>: Crafting high-performance, modular, and maintainable interfaces, with deep expertise in React and CSS optimization.</li>
        <li><strong>Product Strategy</strong>: Using data-driven insights and UX research to develop impactful features and enhance user experiences.</li>
        <li><strong>Team Leadership</strong>: Building and scaling technical teams, streamlining workflows, and fostering continuous improvement.  </li>
      </ul>
      <p className="mb-4">
        This website showcases my journey, skills, and contributions to the tech and product development fields. If you're interested in collaborating, let's have a chat!
      </p>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <Posts posts={posts} />
        <Pagination totalPages={totalPages} currentPage={currentPage} />
      </div>
    </section>


  )
}
