"use client";
import { useEffect, useState } from "react";
import { getAverageRating, getUserRatingForCourse } from "@/lib/rating-service";
import StarRating from "@/app/components/ui/star-rating";
import { handleRating } from "./actions";
import { Star } from "lucide-react";

type CourseRatingProps = {
  courseId: string;
};

export default function CourseRating({ courseId }: CourseRatingProps) {
  const [ratingData, setRatingData] = useState({ average: 0, count: 0 });
  const [userRating, setUserRating] = useState<{ rating: number; review?: string } | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [newRating, setNewRating] = useState(0);
  const [review, setReview] = useState("");

  useEffect(() => {
    const fetchRatingData = async () => {
      const [avgRating, userRatingData] = await Promise.all([
        getAverageRating(courseId),
        getUserRatingForCourse(courseId),
      ]);
      setRatingData(avgRating);
      setUserRating(userRatingData);
    };
    fetchRatingData();
  }, [courseId]);

  const handleSubmitRating = async () => {
    if (newRating === 0) return;

    setIsSubmitting(true);
    try {
      const result = await handleRating(courseId, newRating, review || undefined);
      if (result.success) {
        // Refresh data
        const [avgRating, userRatingData] = await Promise.all([
          getAverageRating(courseId),
          getUserRatingForCourse(courseId),
        ]);
        setRatingData(avgRating);
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
      <h3 className="text-xl font-bold mb-4">Course Rating</h3>

      {ratingData.count > 0 && (
        <div className="flex items-center gap-4 mb-4">
          <div className="flex items-center gap-2">
            <StarRating rating={ratingData.average} size={20} showValue />
            <span className="text-lg font-semibold">
              {ratingData.average.toFixed(1)}
            </span>
          </div>
          <span className="text-base-content/70">
            ({ratingData.count} review{ratingData.count !== 1 ? 's' : ''})
          </span>
        </div>
      )}

      {userRating ? (
        <div className="bg-base-200 p-4 rounded-lg">
          <h4 className="font-semibold mb-2">Your Rating</h4>
          <div className="flex items-center gap-2 mb-2">
            <StarRating rating={userRating.rating} size={16} />
            <span>{userRating.rating} star{userRating.rating !== 1 ? 's' : ''}</span>
          </div>
          {userRating.review && (
            <p className="text-sm text-base-content/80 italic">
              "{userRating.review}"
            </p>
          )}
          <button
            onClick={() => setShowForm(true)}
            className="btn btn-sm btn-outline mt-2"
          >
            Update Rating
          </button>
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
        <div className="bg-base-200 p-4 rounded-lg mt-4">
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
                  className="btn btn-ghost btn-sm p-1"
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
              className="textarea textarea-bordered w-full"
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
      )}
    </div>
  );
}