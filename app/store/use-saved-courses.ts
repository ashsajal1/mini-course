import { create } from "zustand";
import { persist } from "zustand/middleware";

interface SavedCoursesState {
  savedCourseIds: string[];
  saveCourse: (id: string) => void;
  unsaveCourse: (id: string) => void;
  isSaved: (id: string) => boolean;
}

export const useSavedCourses = create<SavedCoursesState>()(
  persist(
    (set, get) => ({
      savedCourseIds: [],
      saveCourse: (id) =>
        set((state) => ({
          savedCourseIds: [...state.savedCourseIds, id],
        })),
      unsaveCourse: (id) =>
        set((state) => ({
          savedCourseIds: state.savedCourseIds.filter(
            (courseId) => courseId !== id
          ),
        })),
      isSaved: (id) => get().savedCourseIds.includes(id),
    }),
    {
      name: "saved-courses-storage",
    }
  )
);
