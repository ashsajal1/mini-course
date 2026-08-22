"use client";
import { useEffect, useState } from "react";
import { getUserRatingForCourse } from "@/lib/rating-service";
import StarRating from "@/app/components/ui/star-rating";
import { handleRating } from "./actions";
import { Star } from "lucide-react";

type CourseRatingProps = {
  courseId: string;
};

export default function CourseRating({ courseId }: CourseRatingProps) {
  const [userRating, setUserRating] = useState<{ rating: number; review?: string | null } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    const fetchUserRating = async () => {
      const userRatingData = await getUserRatingForCourse(courseId);
      setUserRating(userRatingData);
    };
    fetchUserRating();
  }, [courseId]);

  const handleSubmitRating = async () => {
    if (newRating === 0) return;

    setIsSubmitting(true);
    try {
      const result = await handleRating(courseId, newRating, review || undefined);
      if (result.success) {
        // Refresh user rating data
        const userRatingData = await getUserRatingForCourse(courseId);
        setUserRating(userRatingData);
        setShowForm(false);
        setNewRating(0);
        setReview("");
      } else {
        alert(result.error || "Failed to submit rating");
      }
    } catch (error) {
      alert("Failed to submit rating");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-xl font-bold mb-4">Rate This Course</h3>

      {userRating ? (
        <div className="card bg-muted">
          <div className="p-4">
            <h4 className="font-semibold mb-2">Your Rating</h4>
            <div className="flex items-center gap-2 mb-2">
              <StarRating rating={userRating.rating} size={16} />
              <span>{userRating.rating} star{userRating.rating !== 1 ? 's' : ''}</span>
            </div>
            {userRating.review && (
              <p className="text-sm text-muted-foreground italic">
                &quot;{userRating.review}&quot;
              </p>
            )}
            <button
              onClick={() => setShowForm(true)}
              className="btn btn-outline btn-sm mt-2"
            >
              Update Rating
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowForm(true)}
          className="btn btn-primary btn-sm"
        >
          Rate This Course
        </button>
      )}

      {showForm && (
        <div className="card bg-muted mt-4">
          <div className="p-4">
          <h4 className="font-semibold mb-4">
            {userRating ? "Update Your Rating" : "Rate This Course"}
          </h4>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">Rating</label>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  onClick={() => setNewRating(star)}
                  className="btn btn-ghost btn-sm p-1 h-auto"
                >
                  <Star
                    size={24}
                    className={
                      star <= newRating
                        ? "fill-yellow-400 text-yellow-400"
                        : "text-gray-300"
                    }
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="mb-4">
            <label className="block text-sm font-medium mb-2">
              Review (optional)
            </label>
            <textarea
              value={review}
              onChange={(e) => setReview(e.target.value)}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              rows={3}
              placeholder="Share your thoughts about this course..."
            />
          </div>

          <div className="flex gap-2">
            <button
              onClick={handleSubmitRating}
              disabled={isSubmitting || newRating === 0}
              className="btn btn-primary btn-sm"
            >
              {isSubmitting ? "Submitting..." : "Submit Rating"}
            </button>
            <button
              onClick={() => {
                setShowForm(false);
                setNewRating(0);
                setReview("");
              }}
              className="btn btn-ghost btn-sm"
            >
              Cancel
            </button>
          </div>
        </div>
        </div>
      )}
    </div>
  );
}
