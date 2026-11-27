import { Skeleton } from "@/components/ui/skeleton"

export const DataLoading = () => {
  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto w-full max-w-6xl px-4 py-10"
    >
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-muted-foreground">
        Despertando el backend… puede tardar hasta 60 segundos.
      </p>
      <Skeleton className="mt-4 h-10 w-64 rounded-xl" />
      <Skeleton className="mt-8 h-24 w-full rounded-2xl" />
      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {Array.from({ length: 8 }).map((_, index) => (
          <Skeleton key={index} className="aspect-[4/5] w-full rounded-2xl" />
        ))}
      </div>
    </div>
  )
}

export default DataLoading
