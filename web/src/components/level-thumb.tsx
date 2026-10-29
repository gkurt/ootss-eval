import { useEffect, useRef } from "react"
import { cn } from "@/lib/utils"
import { drawThumb } from "@/lib/board"
import { getLevel, useData } from "@/lib/data"

// A small static picture of a level, drawn from its level file.
export function LevelThumb({ name, size = 120, className }: { name: string; size?: number; className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null)
  const { data } = useData(() => getLevel(name), [name])
  useEffect(() => {
    if (data && ref.current) drawThumb(ref.current, data.values, size)
  }, [data, size])
  return (
    <div className={cn("flex items-center justify-center overflow-hidden rounded-md bg-stage", className)}>
      {data ? <canvas ref={ref} className="max-h-full max-w-full" /> : <div className="size-full animate-pulse" />}
    </div>
  )
}
