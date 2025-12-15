"use server";

import { currentUser } from "@clerk/nextjs/server";
import prisma from "@/prisma/client";
import { CourseOutline, ModuleOutline } from "@/lib/course-ai-service";
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
      const moduleOrder = i + 1;

      // Create module
      const newModule = await prisma.module.create({
        data: {
          title: moduleOutline.title,
          course_id: course.id,
          order: moduleOutline.order ?? moduleOrder,
        },
      });

      const moduleId = newModule.id;

      const generatedModule: GeneratedModule = {
        id: moduleId,
        title: newModule.title,
        order: newModule.order ?? moduleOrder,
        slides: [],
        questions: [],
      };

      // Generate slides for this module (or use provided ones)
      let slides: GeneratedSlide[];
      if (moduleOutline.slides && moduleOutline.slides.length > 0) {
        // Use provided slides
        slides = [];
        for (let j = 0; j < moduleOutline.slides.length; j++) {
          const slideOutline = moduleOutline.slides[j];

          // Create content relationship first
          const contentItem = await prisma.content.create({
            data: {
              type: 'SLIDE',
              order: (moduleOrder - 1) * 10 + j + 1,
              module_id: moduleId,
            },
          });

          // Create slide in database
          const slide = await prisma.slide.create({
            data: {
              title: slideOutline.title,
              content: slideOutline.content,
              module_id: moduleId,
              content_item_id: contentItem.id,
            },
          });

          slides.push({
            id: slide.id,
            title: slide.title ?? `Slide ${j + 1}`,
            content: slide.content,
            order: contentItem.order,
          });
        }
      } else {
        // Generate slides using AI
        slides = await generateSlidesForModule(moduleOutline, moduleId, moduleOrder);
      }
      generatedModule.slides = slides;

      // Generate questions for this module (or use provided ones)
      let questions: GeneratedQuestion[];
      if (moduleOutline.questions && moduleOutline.questions.length > 0) {
        // Use provided questions
        questions = [];
        for (let j = 0; j < moduleOutline.questions.length; j++) {
          const questionOutline = moduleOutline.questions[j];

          // Create content relationship first
          const questionContentItem = await prisma.content.create({
            data: {
              type: 'QUESTION',
              order: (moduleOrder - 1) * 10 + slides.length + j + 1,
              module_id: moduleId,
            },
          });

          // Create question in database
          const questionRecord = await prisma.question.create({
            data: {
              title: questionOutline.title,
              content: questionOutline.content,
              module_id: moduleId,
              content_item_id: questionContentItem.id,
            },
          });

          // Create options
          const questionOptions: QuestionOption[] = [];
          for (const optionData of questionOutline.options) {
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
            title: questionRecord.title ?? `Question ${j + 1}`,
            question: questionRecord.content,
            options: questionOptions,
            order: questionContentItem.order,
          });
        }
      } else {
        // Generate questions using AI
        questions = await generateQuestionsForModule(slides, moduleId, moduleOrder, moduleOutline);
      }
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
  moduleOutline: ModuleOutline,
  moduleId: string,
  moduleOrder: number
): Promise<GeneratedSlide[]> {
  const slides: GeneratedSlide[] = [];

  try {
    // Generate 2-4 slides per module based on learning objectives
    const numSlides = Math.min(moduleOutline.learningObjectives.length + 1, 4);

    for (let i = 0; i < numSlides; i++) {
      let slidePrompt = `Create an educational slide for the module: ${moduleOutline.title}`;

      if (i === 0) {
        // Introduction slide - Hook and overview
        slidePrompt = `Create an engaging introduction slide for the module "${moduleOutline.title}".

Module Description: ${moduleOutline.description}

Learning Objectives: ${moduleOutline.learningObjectives.join(', ')}

Make this slide compelling and set expectations for what students will learn. Include:
- A thought-provoking question or statement
- Brief overview of what will be covered
- Why this topic matters (real-world relevance)`;
      } else if (i === numSlides - 1) {
        // Summary/Conclusion slide
        slidePrompt = `Create a comprehensive summary slide for the module "${moduleOutline.title}".

Learning Objectives Covered: ${moduleOutline.learningObjectives.join(', ')}

Include:
- Key takeaways (3-4 main points)
- Next steps or what students should do next
- A memorable quote or key principle
- Connection to broader course goals`;
      } else {
        // Content slides - Deep dive into specific objectives
        const objectiveIndex = i - 1;
        const currentObjective = moduleOutline.learningObjectives[objectiveIndex];

        if (objectiveIndex === 0) {
          // First content slide - Core concepts
          slidePrompt = `Create a detailed content slide explaining the core concept: "${currentObjective}"

For the module "${moduleOutline.title}", focus on:
- Clear definition/explanation
- Key components or elements
- Visual representation ideas (diagrams, examples)
- Common misconceptions to avoid
- Practical applications`;
        } else if (objectiveIndex === 1) {
          // Second content slide - Examples/Case studies
          slidePrompt = `Create an examples slide for: "${currentObjective}"

For the module "${moduleOutline.title}", include:
- 2-3 concrete, real-world examples
- Step-by-step breakdown of a process
- Before/after comparisons
- Success metrics or outcomes
- Industry best practices`;
        } else {
          // Additional content slides - Advanced topics
          slidePrompt = `Create an advanced concepts slide for: "${currentObjective}"

For the module "${moduleOutline.title}", cover:
- Common challenges or pitfalls
- Advanced techniques or strategies
- Tools/frameworks that help
- Future trends or developments
- Expert tips and recommendations`;
        }
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
  moduleOrder: number,
  moduleOutline: ModuleOutline
): Promise<GeneratedQuestion[]> {
  const questions: GeneratedQuestion[] = [];

  try {
    // Generate 2-3 questions per module for comprehensive assessment
    const numQuestions = Math.min(Math.max(slides.length, 2), 3);

    // Create comprehensive module context for better questions
    const moduleContext = `
Module: ${slides[0]?.title || 'Module Content'}
All Slides Content:
${slides.map(slide => `--- ${slide.title} ---\n${slide.content}`).join('\n\n')}

Learning Objectives: ${moduleOutline.learningObjectives.join(', ')}
    `.trim();

    for (let i = 0; i < numQuestions; i++) {
      let questionType = 'conceptual';

      if (i === 0) {
        questionType = 'foundational'; // Test basic understanding
      } else if (i === 1) {
        questionType = 'application'; // Test ability to apply concepts
      } else {
        questionType = 'analysis'; // Test deeper understanding
      }

      // Create specialized prompts for different question types
      const questionPrompt = `Based on this comprehensive module content, create a ${questionType} multiple choice question:

${moduleContext}

Question Type: ${questionType}

Guidelines for ${questionType} questions:
${questionType === 'foundational' ? '- Test basic definitions, terminology, and core concepts' :
 questionType === 'application' ? '- Test ability to apply concepts to real scenarios' :
 '- Test critical thinking, analysis, and connections between ideas'}

Create a challenging but fair question that requires understanding of the material, not just memorization.`;

      // Generate question using existing AI function with enhanced context
      const questionResult = await generateMCQFromSlide(questionPrompt);

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

