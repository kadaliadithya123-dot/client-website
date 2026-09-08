export const SkeletonCard = () => (
  <div className="overflow-hidden rounded-lg border border-black/5">
    <div className="skeleton h-44 w-full" />
    <div className="space-y-2 p-4">
      <div className="skeleton h-4 w-3/4 rounded" />
      <div className="skeleton h-3 w-1/2 rounded" />
    </div>
  </div>
);

export const SkeletonGrid = ({ count = 6 }) => (
  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

const Spinner = ({ size = 24 }) => (
  <span
    className="inline-block animate-spin rounded-full border-2 border-current border-t-transparent"
    style={{ width: size, height: size }}
  />
);

export default Spinner;
