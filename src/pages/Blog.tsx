import { Link } from 'react-router-dom'
import { posts } from '../posts'

export function Blog() {
  return (
    <div>
      <h2 className="text-base font-semibold mb-8">Blog</h2>
      <div className="space-y-8">
        {posts.map((post) => (
          <article key={post.slug} className="group">
            <Link to={`/posts/${post.slug}`} className="block no-underline">
              <time className="text-[var(--color-dim)] text-xs">{post.date}</time>
              <h3 className="text-[var(--color-text)] text-base font-semibold mt-1 group-hover:text-[var(--color-accent)] transition-colors">
                {post.title}
              </h3>
              <p className="text-[var(--color-dim)] text-sm mt-2">{post.summary}</p>
            </Link>
          </article>
        ))}
      </div>
    </div>
  )
}
