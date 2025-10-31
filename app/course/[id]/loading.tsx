export default function Loading() {
  return (
    <div className="animate-pulse space-y-8 p-4 md:p-8" aria-hidden="true">
      {/* Header Section */}
      <div className="flex flex-col space-y-4">
        <div className="h-8 w-3/4 rounded-full bg-base-300 dark:bg-base-200"></div>
        <div className="h-4 w-1/2 rounded-full bg-base-300 dark:bg-base-200"></div>
        
        <div className="flex items-center space-x-4 pt-2">
          <div className="avatar">
            <div className="w-10 h-10 rounded-full bg-base-300 dark:bg-base-200"></div>
          </div>
          <div className="h-4 w-1/4 rounded-full bg-base-300 dark:bg-base-200"></div>
          <div className="h-4 w-1/4 rounded-full bg-base-300 dark:bg-base-200"></div>
        </div>
      </div>

      {/* Course Image */}
      <div className="aspect-video w-full rounded-lg bg-base-300 dark:bg-base-200"></div>

      {/* Course Content */}
      <div className="space-y-4 pt-4">
        <div className="h-6 w-1/3 rounded-full bg-base-300 dark:bg-base-200"></div>
        <div className="space-y-2">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-4 w-full rounded-full bg-base-300 dark:bg-base-200"></div>
          ))}
          <div className="h-4 w-5/6 rounded-full bg-base-300 dark:bg-base-200"></div>
        </div>
      </div>

      {/* Modules Section */}
      <div className="space-y-4 pt-4">
        <div className="h-6 w-1/4 rounded-full bg-base-300 dark:bg-base-200"></div>
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="card bg-base-200 dark:bg-base-300 shadow-sm">
              <div className="card-body p-4">
                <div className="flex justify-between items-center">
                  <div className="h-5 w-1/3 rounded-full bg-base-300 dark:bg-base-200"></div>
                  <div className="h-4 w-16 rounded-full bg-base-300 dark:bg-base-200"></div>
                </div>
                <div className="h-4 w-5/6 rounded-full bg-base-300 dark:bg-base-200 mt-2"></div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap gap-4 pt-4">
        <div className="btn btn-primary w-full sm:w-auto">
          <div className="h-4 w-20 bg-base-100/50 rounded-full"></div>
        </div>
        <div className="btn btn-outline w-full sm:w-auto opacity-50">
          <div className="h-4 w-16 bg-base-300/50 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}