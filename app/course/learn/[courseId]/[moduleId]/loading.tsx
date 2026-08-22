export default function Loading() {
  return (
    <div className="w-full">
      {/* Main Content Area */}
      <div className="w-full min-h-[50vh] flex items-center justify-center p-4">
        <div className="card w-full max-w-4xl bg-muted shadow-xl">
          <div className="card-body">
            {/* Content Placeholder */}
            <div className="flex flex-col items-center justify-center space-y-6">
              {/* Title Placeholder */}
              <div className="h-8 bg-muted rounded-lg w-3/4 animate-pulse"></div>
              
              {/* Content Placeholder (changes based on content type) */}
              <div className="w-full">
                <div className="aspect-video bg-muted rounded-lg animate-pulse mb-4"></div>
                <div className="space-y-3">
                  {[80, 90, 70, 85, 75].map((width, i) => (
                    <div 
                      key={i} 
                      className="h-4 bg-muted rounded-lg animate-pulse" 
                      style={{ width: `${width}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="mt-8 px-4 py-4 border-t border">
        <div className="flex justify-between items-center max-w-4xl mx-auto">
          <button
            className="btn btn-outline opacity-50"
            disabled
            aria-label="Loading previous slide"
          >
            <span className="loading loading-spinner loading-xs"></span>
            <span className="ml-2 hidden md:inline">Previous</span>
          </button>

          <div className="flex items-center space-x-2">
            <span className="text-sm text-muted-foreground">
              Loading content...
            </span>
            <div className="h-2 w-20 bg-muted rounded-full animate-pulse"></div>
          </div>

          <button
            className="btn btn-primary opacity-50"
            disabled
            aria-label="Loading next slide"
          >
            <span className="mr-2 hidden md:inline">Next</span>
            <span className="loading loading-spinner loading-xs"></span>
          </button>
        </div>
      </div>
    </div>
  );
}