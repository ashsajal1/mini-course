"use client";

import { useState, useMemo, useEffect } from "react";
import { Search, Filter, X } from "lucide-react";
import { Course, Category } from "@prisma/client";
import CourseCard from "@/app/components/course/course-card";
import { getCategories } from "@/lib/category-service";

type CourseWithCount = Course & {
  _count: {
    modules: number;
  };
  category?: Category | null;
};

const difficultyOptions = ["Beginner", "Intermediate", "Advanced"] as const;

export default function CourseList({
  courses,
}: {
  courses: CourseWithCount[];
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDifficulties, setSelectedDifficulties] = useState<string[]>(
    []
  );
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [categories, setCategories] = useState<Array<{ id: string; name: string }>>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const categoriesData = await getCategories();
        setCategories(categoriesData);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const filteredCourses = useMemo(() => {
    return courses.filter((course) => {
      // Filter by search query
      const matchesSearch =
        searchQuery === "" ||
        course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        course.description.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by difficulty
      const matchesDifficulty =
        selectedDifficulties.length === 0 ||
        selectedDifficulties.includes(course.difficulty);

      // Filter by category
      const matchesCategory =
        selectedCategories.length === 0 ||
        (course.category_id && selectedCategories.includes(course.category_id));

      return matchesSearch && matchesDifficulty && matchesCategory;
    });
  }, [courses, searchQuery, selectedDifficulties, selectedCategories]);

  const toggleDifficulty = (difficulty: string) => {
    setSelectedDifficulties((prev) =>
      prev.includes(difficulty)
        ? prev.filter((d) => d !== difficulty)
        : [...prev, difficulty]
    );
  };

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prev) =>
      prev.includes(categoryId)
        ? prev.filter((c) => c !== categoryId)
        : [...prev, categoryId]
    );
  };

  const clearFilters = () => {
    setSearchQuery("");
    setSelectedDifficulties([]);
    setSelectedCategories([]);
  };

  const hasActiveFilters =
    searchQuery !== "" || selectedDifficulties.length > 0 || selectedCategories.length > 0;

  return (
    <div className="space-y-6">
      {/* Search and Filter Bar */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-5 w-5 text-base-content/70" />
          </div>
          <input
            type="text"
            placeholder="Search courses..."
            className="input input-bordered w-full pl-10 pr-4 py-2"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-outline"
            onClick={() => setShowFilters(!showFilters)}
          >
            <Filter className="h-4 w-4 mr-2" />
            Filter
            {(selectedDifficulties.length > 0 || selectedCategories.length > 0) && (
              <span className="ml-2 badge badge-primary">
                {selectedDifficulties.length + selectedCategories.length}
              </span>
            )}
          </button>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn btn-ghost">
              Clear all
            </button>
          )}
        </div>
      </div>

      {/* Active Filters */}
      {hasActiveFilters && (
        <div className="flex flex-wrap items-center gap-2">
          {selectedDifficulties.map((difficulty) => (
            <span key={difficulty} className="badge badge-primary gap-2">
              {difficulty}
              <button
                onClick={() => toggleDifficulty(difficulty)}
                className="btn btn-ghost btn-xs p-0 h-4 min-h-4"
                aria-label={`Remove ${difficulty} filter`}
              >
                <X className="h-3 w-3" />
              </button>
            </span>
          ))}
          {selectedCategories.map((categoryId) => {
            const category = categories.find(c => c.id === categoryId);
            return (
              <span key={categoryId} className="badge badge-primary gap-2">
                {category?.name || 'Unknown Category'}
                <button
                  onClick={() => toggleCategory(categoryId)}
                  className="btn btn-ghost btn-xs p-0 h-4 min-h-4"
                  aria-label={`Remove ${category?.name || 'Category'} filter`}
                >
                  <X className="h-3 w-3" />
                </button>
              </span>
            );
          })}
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <div className="bg-base-200 dark:bg-base-300 p-4 rounded-lg space-y-4">
          <div>
            <h3 className="font-medium mb-3">Category</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => toggleCategory(category.id)}
                  className={`btn btn-sm ${
                    selectedCategories.includes(category.id)
                      ? "btn-primary"
                      : "btn-ghost"
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
          </div>
          
          <div>
            <h3 className="font-medium mb-3">Difficulty Level</h3>
            <div className="flex flex-wrap gap-2">
              {difficultyOptions.map((difficulty) => (
                <button
                  key={difficulty}
                  onClick={() => toggleDifficulty(difficulty)}
                  className={`btn btn-sm ${
                    selectedDifficulties.includes(difficulty)
                      ? "btn-primary"
                      : "btn-ghost"
                  }`}
                >
                  {difficulty}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-base-content mb-2">
            No courses found
          </h3>
          <p className="text-base-content/70 mb-4">
            {hasActiveFilters
              ? "Try adjusting your search or filter criteria"
              : "No courses available at the moment"}
          </p>
          {hasActiveFilters && (
            <button onClick={clearFilters} className="btn btn-primary">
              Clear all filters
            </button>
          )}
        </div>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredCourses.map((course) => (
            <CourseCard
              key={course.id}
              id={course.id}
              title={course.name}
              description={course.description}
              difficulty={course.difficulty}
              thumbnail_url={course.thumbnail_url}
              moduleCount={course._count.modules}
            />
          ))}
        </section>
      )}
    </div>
  );
}
