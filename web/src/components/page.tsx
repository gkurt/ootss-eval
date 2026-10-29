import type { ReactNode } from "react"
import { Link } from "react-router"
import { CheckIcon, XIcon } from "lucide-react"
import { cn } from "@/lib/utils"

import { Badge } from "@/components/ui/badge"
import { Skeleton } from "@/components/ui/skeleton"
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip"
import { modelColor, modelName, TRACK } from "@/lib/format"
import type { Track } from "@/lib/data"

export function PageHeader({ eyebrow, title, children, actions }: { eyebrow?: ReactNode; title: ReactNode; children?: ReactNode; actions?: ReactNode }) {
  return (
    <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
      <div className="min-w-0 space-y-2">
        {eyebrow && <div className="text-xs font-medium tracking-wider text-muted-foreground uppercase">{eyebrow}</div>}
        <h1 className="text-2xl font-semibold tracking-tight text-balance sm:text-3xl">{title}</h1>
        {children && <div className="max-w-3xl text-sm text-pretty text-muted-foreground sm:text-base">{children}</div>}
      </div>
      {actions && <div className="flex shrink-0 flex-wrap gap-2">{actions}</div>}
    </div>
  )
}

export function Section({ title, description, children, className, actions }: { title: ReactNode; description?: ReactNode; children: ReactNode; className?: string; actions?: ReactNode }) {
  return (
    <section className={cn("mt-12 first:mt-0", className)}>
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h2 className="text-lg font-semibold tracking-tight">{title}</h2>
          {description && <p className="max-w-3xl text-sm text-muted-foreground">{description}</p>}
        </div>
        {actions}
      </div>
      {children}
    </section>
  )
}

export function Loading({ rows = 3 }: { rows?: number }) {
  return (
    <div className="space-y-4">
      <Skeleton className="h-8 w-72" />
      <Skeleton className="h-4 w-full max-w-xl" />
      {Array.from({ length: rows }, (_, i) => (
        <Skeleton key={i} className="h-32 w-full" />
      ))}
    </div>
  )
}

export function ErrorState({ error }: { error: Error }) {
  return (
    <div className="rounded-xl border border-dashed p-10 text-center">
      <div className="font-medium">Could not load this page</div>
      <div className="mt-1 font-mono text-xs text-muted-foreground">{error.message}</div>
      <p className="mt-3 text-sm text-muted-foreground">
        Run <code className="font-mono">npm run data</code> in <code className="font-mono">web/</code> to build the site data.
      </p>
    </div>
  )
}

export function NotFound() {
  return (
    <div className="py-24 text-center">
      <div className="text-5xl font-semibold tracking-tight">404</div>
      <p className="mt-2 text-muted-foreground">Nothing here.</p>
      <Link to="/" className="mt-4 inline-block text-sm text-primary underline-offset-4 hover:underline">
        Back to the overview
      </Link>
    </div>
  )
}

export function ModelDot({ model, className }: { model: string; className?: string }) {
  return <span className={cn("inline-block size-2 shrink-0 rounded-full", className)} style={{ background: modelColor(model) }} />
}

export function ModelLabel({ model, className }: { model: string; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-2 font-medium whitespace-nowrap", className)}>
      <ModelDot model={model} />
      {modelName(model)}
    </span>
  )
}

export function TrackBadge({ track }: { track: Track }) {
  return (
    <Tooltip>
      <TooltipTrigger render={<Badge variant="outline" className="font-normal" />}>{TRACK[track].name}</TooltipTrigger>
      <TooltipContent>{TRACK[track].blurb}</TooltipContent>
    </Tooltip>
  )
}

export function TierBadge({ tier, className }: { tier: number; className?: string }) {
  const open = tier >= 6
  return (
    <span
      className={cn(
        "inline-flex h-5 items-center rounded-md px-1.5 font-mono text-[11px] font-medium tabular-nums",
        open ? "bg-gold/15 text-gold ring-1 ring-gold/30" : "bg-muted text-muted-foreground",
        className,
      )}
    >
      {open ? "open" : `T${tier}`}
    </span>
  )
}

export function Outcome({ ok, children, className }: { ok: boolean; children: ReactNode; className?: string }) {
  return (
    <span className={cn("inline-flex items-center gap-1 font-medium whitespace-nowrap", ok ? "text-win" : "text-loss", className)}>
      {ok ? <CheckIcon className="size-3.5" strokeWidth={3} /> : <XIcon className="size-3.5" strokeWidth={3} />}
      {children}
    </span>
  )
}

// A fraction as a slim bar with its label.
export function Meter({ value, total, className, color = "var(--win)" }: { value: number; total: number; className?: string; color?: string }) {
  const pct = total ? (100 * value) / total : 0
  return (
    <div className={cn("flex items-center gap-2.5", className)}>
      <span className="w-10 text-right font-mono text-sm font-medium tabular-nums">
        {value}/{total}
      </span>
      <div className="h-1.5 min-w-12 flex-1 overflow-hidden rounded-full bg-muted">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  )
}

export function Stat({ label, value, hint, className }: { label: ReactNode; value: ReactNode; hint?: ReactNode; className?: string }) {
  return (
    <div className={cn("min-w-0", className)}>
      <div className="text-xs text-muted-foreground">{label}</div>
      <div className="mt-0.5 truncate font-medium tabular-nums">{value}</div>
      {hint && <div className="text-xs text-muted-foreground">{hint}</div>}
    </div>
  )
}
