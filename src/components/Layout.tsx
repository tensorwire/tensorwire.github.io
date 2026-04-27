import { Outlet, Link } from 'react-router-dom'

export function Layout() {
  return (
    <div className="max-w-2xl mx-auto px-6 py-12">
      <header className="mb-16">
        <Link to="/" className="no-underline flex items-center gap-3">
          <img src="/logo.png" alt="tensorwire" className="w-10 h-10" />
          <h1 className="text-[var(--color-accent)] text-xl font-bold tracking-tight">
            tensorwire
          </h1>
        </Link>
        <p className="text-[var(--color-dim)] text-sm mt-1">
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
