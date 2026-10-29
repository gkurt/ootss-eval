import Markdown from "react-markdown"
import remarkGfm from "remark-gfm"
import { ErrorState, Loading, PageHeader } from "@/components/page"
import { getRules, useData } from "@/lib/data"

export function RulesPage() {
  const { data, error } = useData(getRules, [])
  if (error) return <ErrorState error={error} />
  if (!data) return <Loading />
  // the file's own title is replaced by the page header
  const body = data.replace(/^# .*\n/, "")
  return (
    <div className="max-w-3xl">
      <PageHeader eyebrow="kit/RULES.md" title="The rule book">
        Exactly what every model reads first, in its system prompt.
      </PageHeader>
      <article className="prose-run">
        <Markdown remarkPlugins={[remarkGfm]}>{body}</Markdown>
      </article>
    </div>
  )
}
