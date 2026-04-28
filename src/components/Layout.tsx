import { Outlet, Link, useLocation } from 'react-router-dom'

export function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <header className="mb-12">
        <div className="flex items-center justify-between">
          <Link to="/" className="no-underline flex items-center gap-3">
            <img src="/logo.png" alt="tensorwire" className="w-10 h-10" />
            <h1 className="text-[var(--color-accent)] text-xl font-bold tracking-tight">
              tensorwire
            </h1>
          </Link>
          <nav className="flex gap-6 text-sm">
            <Link
              to="/"
              className={`no-underline transition-colors ${pathname === '/' ? 'text-[var(--color-accent)]' : 'text-[var(--color-dim)] hover:text-[var(--color-text)]'}`}
            >
              home
            </Link>
            <Link
              to="/blog"
              className={`no-underline transition-colors ${pathname.startsWith('/blog') || pathname.startsWith('/posts') ? 'text-[var(--color-accent)]' : 'text-[var(--color-dim)] hover:text-[var(--color-text)]'}`}
            >
              blog
            </Link>
            <a
              href="https://github.com/tensorwire"
              className="text-[var(--color-dim)] hover:text-[var(--color-text)] no-underline transition-colors"
            >
              github
            </a>
          </nav>
        </div>
        <p className="text-[var(--color-dim)] text-sm mt-2">
          solo dev · gpu training in go · building from scratch
        </p>
      </header>
      <main>
        <Outlet />
      </main>
      <footer className="mt-20 pt-8 border-t border-[var(--color-border)] text-[var(--color-dim)] text-xs">
        <p>
          <a href="https://github.com/tensorwire" className="text-[var(--color-accent)] hover:underline">github</a>
          {' · '}
          built by one person
        </p>
      </footer>
    </div>
  )
}
