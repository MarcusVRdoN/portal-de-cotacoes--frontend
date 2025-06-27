export function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center p-4">
      <div className="w-8 h-8 border-b-2 rounded-full animate-spin border-primary"></div>
    </div>
  )
}

export function LoadingSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="animate-pulse">
          <div className="flex items-center p-4 space-x-4 border rounded-lg">
            <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
            <div className="flex-1 space-y-2">
              <div className="w-3/4 h-4 bg-gray-200 rounded"></div>
              <div className="w-1/2 h-3 bg-gray-200 rounded"></div>
            </div>
            <div className="w-20 h-8 bg-gray-200 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  )
}