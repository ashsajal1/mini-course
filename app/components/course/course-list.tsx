"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import { Search, Filter, X } from "lucide-react";
import { Course, Category } from "@/generated/prisma";
import CourseCard from "@/app/components/course/course-card";

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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const searchRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut: Ctrl/Cmd+K or "/" focuses search
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;
      if ((e.key === "k" && (e.metaKey || e.ctrlKey)) || (e.key === "/" && !typing)) {
        e.preventDefault();
        searchRef.current?.focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  // Search suggestions from visible courses
  const suggestions = useMemo(() => {
    if (searchQuery.trim() === "") return [];
    const q = searchQuery.toLowerCase();
    return courses
      .filter((course) => course.name.toLowerCase().includes(q))
      .slice(0, 6);
  }, [courses, searchQuery]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch("/api/categories");
        const categoriesData = await res.json();
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
      <div className="flex flex-col md:flex-row gap-3 mt-3">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none">
            <Search className="h-4.5 w-4.5 text-muted-foreground" />
          </div>
          <input
            ref={searchRef}
            type="text"
            placeholder="Search courses..."
            className="w-full h-11 pl-10 pr-20 rounded-xl bg-card border border-border text-sm text-foreground placeholder:text-muted-foreground transition-all focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary/50"
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setShowSuggestions(true);
            }}
            onFocus={() => setShowSuggestions(true)}
            onBlur={() => setTimeout(() => setShowSuggestions(false), 150)}
            onKeyDown={(e) => {
              if (e.key === "Escape") {
                setSearchQuery("");
                searchRef.current?.blur();
              }
            }}
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center gap-1.5">
            {searchQuery ? (
              <button
                onClick={() => {
                  setSearchQuery("");
                  searchRef.current?.focus();
                }}
                className="grid place-items-center h-6 w-6 rounded-full bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors"
                aria-label="Clear search"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            ) : (
              <kbd className="hidden sm:inline-flex items-center h-5.5 px-1.5 rounded-md border border-border bg-muted text-[10px] font-semibold text-muted-foreground">
                /
              </kbd>
            )}
          </div>

          {/* Suggestions dropdown */}
          {showSuggestions && searchQuery.trim() !== "" && (
            <div className="absolute z-20 top-full mt-2 w-full rounded-xl bg-card border border-border shadow-xl overflow-hidden">
              {suggestions.length > 0 ? (
                suggestions.map((course) => (
                  <button
                    key={course.id}
                    onMouseDown={() => {
                      setSearchQuery(course.name);
                      setShowSuggestions(false);
                    }}
                    className="w-full flex items-center justify-between gap-3 px-4 py-2.5 text-left text-sm hover:bg-muted transition-colors"
                  >
                    <span className="truncate font-medium text-foreground">
                      {course.name}
                    </span>
                    <span className="badge badge-secondary badge-sm shrink-0">
                      {course.difficulty}
                    </span>
                  </button>
                ))
              ) : (
                <p className="px-4 py-3 text-sm text-muted-foreground">
                  No courses match &ldquo;{searchQuery}&rdquo;
                </p>
              )}
            </div>
          )}
        </div>
        <div className="flex gap-2">
          <button
            className="btn btn-outline h-11 rounded-xl"
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
            <button onClick={clearFilters} className="btn btn-ghost h-11 rounded-xl">
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
        <div className="bg-muted dark:bg-muted p-4 rounded-lg space-y-4">
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

      {/* Result count */}
      {hasActiveFilters && filteredCourses.length > 0 && (
        <p className="text-sm text-muted-foreground">
          <span className="font-semibold text-foreground">
            {filteredCourses.length}
          </span>{" "}
          {filteredCourses.length === 1 ? "course" : "courses"} found
        </p>
      )}

      {/* Course Grid */}
      {filteredCourses.length === 0 ? (
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-foreground mb-2">
            No courses found
          </h3>
          <p className="text-muted-foreground mb-4">
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
              lang={course.lang || "en"}
              thumbnail_url={course.thumbnail_url}
              moduleCount={course._count.modules}
            />
          ))}
        </section>
      )}
    </div>
  );
}
