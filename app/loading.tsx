export default function Loading() {
  return (
    <div className="animate-pulse p-4 md:p-8 max-w-6xl mx-auto" aria-hidden="true">
      {/* Header */}
      <div className="mb-8 space-y-2">
        <div className="h-8 w-64 rounded-full bg-base-300 dark:bg-base-200"></div>
        <div className="h-4 w-48 rounded-full bg-base-300 dark:bg-base-200"></div>
      </div>

      {/* Course Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="card bg-base-100 dark:bg-base-200 shadow-sm hover:shadow-md transition-shadow">
            {/* Image */}
            <figure>
              <div className="aspect-video w-full bg-base-300 dark:bg-base-300"></div>
            </figure>
            
            {/* Content */}
            <div className="card-body p-4">
              <div className="h-5 w-3/4 rounded-full bg-base-300 dark:bg-base-300 mb-2"></div>
              <div className="h-4 w-1/2 rounded-full bg-base-300 dark:bg-base-300 mb-3"></div>
              
              <div className="flex items-center justify-between mt-auto">
                <div className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-base-300 dark:bg-base-300"></div>
                  <div className="h-3 w-16 rounded-full bg-base-300 dark:bg-base-300"></div>
                </div>
                <div className="h-6 w-16 rounded-full bg-base-300 dark:bg-base-300"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
      
      {/* Pagination */}
      <div className="flex justify-center mt-8">
        <div className="join">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="join-item btn btn-sm btn-disabled w-10 h-10">
              <div className="h-4 w-4 rounded-full bg-base-300 dark:bg-base-300"></div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}