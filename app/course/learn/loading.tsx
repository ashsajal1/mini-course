export default function Loading() {
  return (
    <div className="min-h-screen bg-base-100">
      <div className="container mx-auto py-12 px-4 sm:px-6 md:px-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body">
                {/* Video/Lesson Placeholder */}
                <div className="aspect-video bg-base-300 rounded-lg animate-pulse"></div>
                
                {/* Header Skeleton */}
                <div className="mt-6 space-y-2">
                  <div className="h-8 bg-base-300 rounded-lg w-3/4 animate-pulse"></div>
                  <div className="h-4 bg-base-300 rounded-lg w-1/2 animate-pulse"></div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-base-300 rounded-full h-2.5 mt-4">
                  <div className="bg-primary h-2.5 rounded-full w-1/3"></div>
                </div>

                {/* Lesson Navigation */}
                <div className="flex flex-col sm:flex-row justify-between gap-4 mt-6">
                  <button className="btn btn-outline btn-primary btn-sm sm:btn-md w-full sm:w-auto opacity-50" disabled>
                    <span className="loading loading-spinner loading-xs"></span>
                    Loading...
                  </button>
                  <div className="join grid grid-cols-2 gap-2 w-full sm:w-auto">
                    <button className="btn btn-outline join-item" disabled>
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                      </svg>
                      Previous
                    </button>
                    <button className="btn btn-primary join-item" disabled>
                      Next
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    </button>
                  </div>
                </div>

                {/* Content Skeleton */}
                <div className="mt-8 space-y-4">
                  {[60, 80, 75, 90, 65].map((width, i) => (
                    <div 
                      key={i} 
                      className="h-4 bg-base-300 rounded-lg animate-pulse" 
                      style={{ width: `${width}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:w-80 space-y-4">
            <div className="card bg-base-200 shadow-xl">
              <div className="card-body p-4">
                <h3 className="card-title text-lg font-semibold mb-4">Course Content</h3>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="flex items-center gap-3 p-2 rounded-lg hover:bg-base-300 transition-colors">
                      <div className="h-10 w-16 bg-base-300 rounded-lg animate-pulse"></div>
                      <div className="flex-1 space-y-1">
                        <div className="h-4 bg-base-300 rounded-lg w-3/4 animate-pulse"></div>
                        <div className="h-3 bg-base-300 rounded-lg w-1/2 animate-pulse"></div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
