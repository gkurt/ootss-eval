import { useEffect } from "react"
import { Route, Routes, useLocation } from "react-router"

import { SiteHeader } from "@/components/site-header"
import { OverviewPage } from "@/pages/overview"
import { RunsPage } from "@/pages/runs"
import { RunPage } from "@/pages/run"
import { ReplayPage } from "@/pages/replay"
import { LevelsPage } from "@/pages/levels"
import { LevelPage } from "@/pages/level"
import { MethodPage } from "@/pages/method"
import { RulesPage } from "@/pages/rules"
import { SharePage } from "@/pages/share"
import { NotFound } from "@/components/page"

export function App() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  // the share card is a bare 1600×900 page, without the site's header and footer
  if (pathname === "/share") return <SharePage />
  return (
    <div className="flex min-h-svh flex-col">
      <SiteHeader />
      <main className="mx-auto w-full max-w-7xl flex-1 px-4 pt-6 pb-16 sm:px-6 lg:px-8">
        <Routes>
          <Route path="/" element={<OverviewPage />} />
          <Route path="/runs" element={<RunsPage />} />
          <Route path="/runs/:id" element={<RunPage />} />
          <Route path="/runs/:id/:model/:track/:level" element={<ReplayPage />} />
          <Route path="/levels" element={<LevelsPage />} />
          <Route path="/levels/:name" element={<LevelPage />} />
          <Route path="/method" element={<MethodPage />} />
          <Route path="/rules" element={<RulesPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      <footer className="border-t">
        <div className="mx-auto flex max-w-7xl flex-col gap-1 px-4 py-6 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:px-6 lg:px-8">
          <span>Claude models on puzzle levels from the Order of the Sinking Star demo.</span>
          <span>Every answer is scored by the rules engine in kit/engine; replays run the same engine in your browser.</span>
        </div>
      </footer>
    </div>
  )
}

export default App
