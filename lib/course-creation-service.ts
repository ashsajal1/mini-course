"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/prisma/client";
import { CourseOutline } from "@/lib/course-ai-service";
import { generateSlideContent } from "@/app/course/edit/[id]/slide/ai-actions";
import { generateMCQFromSlide } from "@/app/course/edit/[id]/question/ai-actions";

export interface CourseGenerationProgress {
  stage: 'creating-course' | 'generating-slides' | 'generating-questions' | 'finalizing';
  progress: number;
  message: string;
  currentModule?: number;
  totalModules?: number;
}

export interface GeneratedCourse {
  id: string;
  title: string;
  description: string;
  modules: GeneratedModule[];
}

export interface GeneratedModule {
  id: string;
  title: string;
  order: number;
  slides: GeneratedSlide[];
  questions: GeneratedQuestion[];
}

export interface GeneratedSlide {
  id: string;
  title: string;
  content: string;
  order: number;
}

export interface GeneratedQuestion {
  id: string;
  title: string;
  question: string;
  options: QuestionOption[];
  order: number;
}

export interface QuestionOption {
  id: string;
  text: string;
  isCorrect: boolean;
  explanation: string;
}

/**
 * Creates a full course from an outline, including slides and questions
 */
export async function createCourseFromOutline(
  outline: CourseOutline
): Promise<{ success: boolean; course?: GeneratedCourse; error?: string }> {
  "use server";

  try {
    const user = await currentUser();
    if (!user) {
      return { success: false, error: "Unauthorized" };
    }

    // Stage 1: Create course record

    const course = await prisma.course.create({
      data: {
        name: outline.title,
        description: outline.description,
        difficulty: outline.difficulty,
        lang: outline.language,
        thumbnail_url: "", // Will be updated later if needed
        creator: user.id,
      },
    });

    const generatedCourse: GeneratedCourse = {
      id: course.id,
      title: course.name,
      description: course.description,
      modules: [],
    };

    // Stage 2: Generate modules with content

    for (let i = 0; i < outline.modules.length; i++) {
      const moduleOutline = outline.modules[i];

      // Create module
      const newModule = await prisma.module.create({
        data: {
          title: moduleOutline.title,
          course_id: course.id,
          order: moduleOutline.order ?? i + 1,
        },
      });

      const generatedModule: GeneratedModule = {
        id: newModule.id,
        title: newModule.title,
        order: newModule.order ?? i + 1,
        slides: [],
        questions: [],
      };

      // Generate slides for this module
      const slides = await generateSlidesForModule(moduleOutline, module.id, i + 1);
      generatedModule.slides = slides;

      // Generate questions for this module

      const questions = await generateQuestionsForModule(slides, module.id, i + 1);
      generatedModule.questions = questions;

      generatedCourse.modules.push(generatedModule);
    }

    // Stage 3: Finalize
    // Update course with completion status or any final touches

    return { success: true, course: generatedCourse };

  } catch (error) {
    console.error("Error creating course from outline:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create course",
    };
  }
}

/**
 * Generates slides for a module based on its outline
 */
async function generateSlidesForModule(
  moduleOutline: any,
  moduleId: string,
  moduleOrder: number
): Promise<GeneratedSlide[]> {
  const slides: GeneratedSlide[] = [];

  try {
    // Generate 2-3 slides per module based on learning objectives
    const numSlides = Math.min(moduleOutline.learningObjectives.length + 1, 3);

    for (let i = 0; i < numSlides; i++) {
      let slidePrompt = `Create a slide about ${moduleOutline.title}`;

      if (i === 0) {
        // Introduction slide
        slidePrompt = `Create an introduction slide for the module: ${moduleOutline.title}. Description: ${moduleOutline.description}`;
      } else if (i === numSlides - 1) {
        // Summary slide
        slidePrompt = `Create a summary slide for the module: ${moduleOutline.title}. Cover the key learning objectives: ${moduleOutline.learningObjectives.join(', ')}`;
      } else {
        // Content slide
        const objective = moduleOutline.learningObjectives[i - 1];
        slidePrompt = `Create a content slide for: ${objective}`;
      }

      // Generate slide content using existing AI function
      const slideResult = await generateSlideContent(slidePrompt);

      if (slideResult.success && slideResult.content) {
        // Create content relationship first
        const contentItem = await prisma.content.create({
          data: {
            type: 'SLIDE',
            order: (moduleOrder - 1) * 10 + i + 1, // Module-based ordering
            module_id: moduleId,
          },
        });

        // Create slide in database
        const slide = await prisma.slide.create({
          data: {
            title: slideResult.title || `Slide ${i + 1}`,
            content: slideResult.content,
            module_id: moduleId,
            content_item_id: contentItem.id,
          },
        });

        slides.push({
          id: slide.id,
          title: slide.title ?? `Slide ${i + 1}`,
          content: slide.content,
          order: contentItem.order,
        });
      }
    }
  } catch (error) {
    console.error("Error generating slides for module:", error);
  }

  return slides;
}

/**
 * Generates questions for a module based on its slides
 */
async function generateQuestionsForModule(
  slides: GeneratedSlide[],
  moduleId: string,
  moduleOrder: number
): Promise<GeneratedQuestion[]> {
  const questions: GeneratedQuestion[] = [];

  try {
    // Generate 1-2 questions per module
    const numQuestions = Math.min(slides.length, 2);

    for (let i = 0; i < numQuestions; i++) {
      const slide = slides[i];

      // Generate question using existing AI function
      const questionResult = await generateMCQFromSlide(slide.content);

      if (questionResult.success && questionResult.mcq) {
        // Create content relationship first
        const questionContentItem = await prisma.content.create({
          data: {
            type: 'QUESTION',
            order: (moduleOrder - 1) * 10 + slides.length + i + 1, // After slides
            module_id: moduleId,
          },
        });

        // Create question in database
        const questionRecord = await prisma.question.create({
          data: {
            title: questionResult.mcq.title || `Question ${i + 1}`,
            content: questionResult.mcq.question,
            module_id: moduleId,
            content_item_id: questionContentItem.id,
          },
        });

        // Create options
        const questionOptions: QuestionOption[] = [];
        for (const optionData of questionResult.mcq.options) {
          const option = await prisma.option.create({
            data: {
              text: optionData.text,
              isCorrect: optionData.isCorrect,
              explanation: optionData.explanation || "",
              questionId: questionRecord.id,
            },
          });

          questionOptions.push({
            id: option.id,
            text: option.text,
            isCorrect: option.isCorrect,
            explanation: option.explanation ?? "",
          });
        }

        questions.push({
          id: questionRecord.id,
          title: questionRecord.title ?? `Question ${i + 1}`,
          question: questionRecord.content,
          options: questionOptions,
          order: questionContentItem.order,
        });
      }
    }
  } catch (error) {
    console.error("Error generating questions for module:", error);
  }

  return questions;
}

