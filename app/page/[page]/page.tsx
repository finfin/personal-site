import { getPaginatedPosts } from '../../blog/utils';
import { Posts } from '../../components/posts';
import Pagination from '../../components/Pagination';
import { notFound } from 'next/navigation';

interface PageProps {
  params: {
    page: string;
  };
}

export default function Page({ params }: PageProps) {
  const pageNumber = parseInt(params.page);
  
  if (isNaN(pageNumber)) {
    notFound();
  }

  const { posts, totalPages, currentPage } = getPaginatedPosts(pageNumber);
  
  if (pageNumber > totalPages) {
    notFound();
  }

  return (
    <main className="max-w-4xl mx-auto px-4 py-8">
      <Posts posts={posts} />
      <Pagination totalPages={totalPages} currentPage={currentPage} />
    </main>
  );
} 