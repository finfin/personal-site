import { getPaginatedPosts } from './blog/utils';
import { Posts } from './components/posts';
import Pagination from './components/Pagination';

export default function Home() {
  const { posts, totalPages, currentPage } = getPaginatedPosts(1);
  
  return (
    <section>
      <h1 className="mb-8 text-2xl font-semibold tracking-tighter">
        About Me
      </h1>
      <p className="mb-4">
        Hi, I'm Fin, a web developer and product strategist with over a decade of experience in turning ideas into impactful digital solutions. My expertise lies in frontend development, product management, and team leadership, where I bridge the gap between technology and user needs to create better products.
      </p>
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
