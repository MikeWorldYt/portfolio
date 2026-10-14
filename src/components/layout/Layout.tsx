import { Outlet } from 'react-router'
import { useLocale } from '../../i18n/useLocale.ts'
import { Footer } from './Footer.tsx'
import { Header } from './Header.tsx'

export function Layout() {
  const { t } = useLocale()

  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:p-2 focus-visible:outline-2"
      >
        {t.nav.skipToContent}
      </a>
      <Header />
      <main id="main" tabIndex={-1} className="flex-1 px-4 py-8">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}
