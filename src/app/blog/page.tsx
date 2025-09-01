import { PageLayout } from '@/components/page-layout';
import Link from 'next/link';

const articles = [
  {
    id: 'getting-started-with-ai-design',
    title: 'Getting Started with AI-Powered Design',
    excerpt: 'Learn how to create stunning designs with AI in just a few clicks.',
    date: '2025-08-15',
    readTime: '5 min read',
  },
  {
    id: 'ai-design-trends-2025',
    title: 'Top AI Design Trends in 2025',
    excerpt: 'Discover the latest trends in AI-generated design and how to implement them.',
    date: '2025-08-01',
    readTime: '7 min read',
  },
  {
    id: 'maximizing-creativity-with-ai',
    title: 'Maximizing Creativity with AI Tools',
    excerpt: 'How to use AI to enhance your creative workflow and boost productivity.',
    date: '2025-07-20',
    readTime: '6 min read',
  },
];

export default function BlogPage() {
  return (
    <PageLayout
      title="Blog"
      description="Insights, tutorials, and updates about AI-powered design"
    >
      <div className="max-w-4xl mx-auto">
        <div className="space-y-12">
          {articles.map((article) => (
            <article key={article.id} className="group">
              <Link href={`/blog/${article.id}`}>
                <div className="bg-card p-6 rounded-lg border hover:border-primary transition-colors">
                  <div className="flex justify-between items-start">
                    <h2 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors">
                      {article.title}
                    </h2>
                    <span className="text-sm text-muted-foreground">
                      {new Date(article.date).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </span>
                  </div>
                  <p className="text-muted-foreground mb-4">{article.excerpt}</p>
                  <div className="text-sm text-primary flex items-center">
                    Read more
                    <svg
                      className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </div>
    </PageLayout>
  );
}
