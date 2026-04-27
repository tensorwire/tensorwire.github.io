import { useParams, Link } from 'react-router-dom'
import Markdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { posts } from '../posts'
import { useEffect, useState, type ReactNode } from 'react'

export function Post() {
  const { slug } = useParams<{ slug: string }>()
  const meta = posts.find((p) => p.slug === slug)
  const [content, setContent] = useState<string>('')
  const [chart, setChart] = useState<ReactNode>(null)

  useEffect(() => {
    if (!slug) return
    if (meta?.hasChart) {
      import(`../posts/${slug}.tsx`).then((mod) => {
        setContent(mod.content)
        if (mod.BenchChart) setChart(<mod.BenchChart />)
      })
    } else {
      import(`../posts/${slug}.ts`).then((mod) => setContent(mod.content))
    }
  }, [slug, meta])

  if (!meta) {
    return (
      <div>
        <p className="text-[var(--color-dim)]">Post not found.</p>
        <Link to="/" className="text-[var(--color-accent)]">back</Link>
      </div>
    )
  }

  return (
    <article>
      <Link to="/" className="text-[var(--color-dim)] text-xs hover:text-[var(--color-accent)] transition-colors">
        &larr; back
      </Link>
      <header className="mt-6 mb-10">
        <time className="text-[var(--color-dim)] text-xs">{meta.date}</time>
        <h1 className="text-[var(--color-accent)] text-xl font-bold mt-2">{meta.title}</h1>
      </header>
      <div className="prose prose-invert max-w-none">
        {chart}
        <Markdown remarkPlugins={[remarkGfm]}>{content}</Markdown>
      </div>
    </article>
  )
}
