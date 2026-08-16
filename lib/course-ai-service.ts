"use server"

import Groq from "groq-sdk";
import {
  extractContentFromUrl,
  summarizeForOutline,
} from "@/lib/url-content-extractor";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export interface SlideOutline {
  title: string;
  content: string;
  order: number;
}

export interface QuestionOutline {
  title: string;
  content: string;
  options: {
    text: string;
    isCorrect: boolean;
    explanation?: string;
  }[];
  order: number;
}

export interface ModuleOutline {
  title: string;
  description: string;
  learningObjectives: string[];
  estimatedDuration: string;
  order: number;
  slides?: SlideOutline[];
  questions?: QuestionOutline[];
}

export interface CourseOutline {
  title: string;
  description: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  estimatedDuration: string;
  language: string;
  modules: ModuleOutline[];
}

export interface CourseOutlineResponse {
  success: boolean;
  outline?: CourseOutline;
  error?: string;
}

/**
 * Generates a course outline from a document URL.
 * Fetches the URL content ourselves, extracts clean text,
 * then sends it to the AI model for outline generation.
 */
export async function generateCourseOutline(url: string): Promise<CourseOutlineResponse> {
  "use server";
  if (!process.env.GROQ_API_KEY) {
    return {
      success: false,
      error: "AI service not configured",
    };
  }

  if (!url || !isValidUrl(url)) {
    return {
      success: false,
      error: "Invalid URL provided",
    };
  }

  try {
    // Step 1: Fetch and extract content from URL
    let extractedContent;
    try {
      extractedContent = await extractContentFromUrl(url);
    } catch (fetchError) {
      console.error("Failed to fetch URL content:", fetchError);
      return {
        success: false,
        error: `Failed to fetch content from URL: ${
          fetchError instanceof Error ? fetchError.message : "Unknown error"
        }. Please check the URL and try again.`,
      };
    }

    if (!extractedContent.text || extractedContent.text.trim().length < 50) {
      return {
        success: false,
        error:
          "Could not extract meaningful content from the URL. The page may be empty, require authentication, or contain only images/videos.",
      };
    }

    // Step 2: Handle large content by summarizing key sections
    const contentForAI = await summarizeForOutline(extractedContent.text);

    // Step 3: Send extracted content to AI for outline generation
    const systemPrompt = `Analyze the following document content and create a structured course outline.

Requirements:
- 3-6 modules with logical progression
- Specific, measurable learning objectives per module
- Realistic time estimates per module
- Difficulty: Beginner/Intermediate/Advanced
- Language matches document (default: English)
- Use the document's actual topics, terminology, and structure

Return ONLY valid JSON (no markdown, no code blocks):
{
  "title": "Course title based on document content",
  "description": "2-3 sentence description of what this course covers",
  "difficulty": "Beginner|Intermediate|Advanced",
  "language": "en",
  "estimatedDuration": "X hours",
  "modules": [
    {
      "title": "Module title",
      "description": "What this module covers",
      "learningObjectives": ["Specific objective 1", "Specific objective 2"],
      "estimatedDuration": "X min",
      "order": 1
    }
  ]
}`;

    const userPrompt = `Document title: ${extractedContent.title}

Document content:
${contentForAI}

Create a course outline based on this content. The course should teach the material covered in the document.`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 4096,
    });

    const aiContent = completion.choices[0]?.message?.content;

    if (!aiContent) {
      return {
        success: false,
        error: "No content generated from AI",
      };
    }

    // Parse the JSON response
    let outlineData: CourseOutline;
    try {
      // Remove any potential markdown code block wrappers
      const cleanedContent = aiContent
        .replace(/^```(?:json)?\n?/gm, "")
        .replace(/```$/gm, "")
        .trim();
      outlineData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse outline JSON:", parseError);
      console.error("Raw content:", aiContent);
      return {
        success: false,
        error: "Failed to parse generated outline. Please try again.",
      };
    }

    // Validate the response structure
    if (!outlineData.title || !outlineData.modules || outlineData.modules.length === 0) {
      return {
        success: false,
        error: "Invalid outline structure generated",
      };
    }

    // Ensure modules have proper order
    outlineData.modules.forEach((module, index) => {
      module.order = index + 1;
    });

    return {
      success: true,
      outline: outlineData,
    };

  } catch (error) {
    console.error("Error generating course outline:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate course outline",
    };
  }
}

/**
 * Validates if a URL is properly formatted
 */
function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);

    // Check for supported protocols (HTTP and HTTPS)
    return ['http:', 'https:'].includes(urlObj.protocol);
  } catch {
    return false;
  }
}

/**
 * Estimates course complexity and suggests generation settings
 */
export async function estimateCourseComplexity(outline: CourseOutline): Promise<{ totalSlides: number; totalQuestions: number; estimatedGenerationTime: string; }> {
  const moduleCount = outline.modules.length;
  const avgSlidesPerModule = outline.difficulty === 'Advanced' ? 3 : outline.difficulty === 'Intermediate' ? 2 : 1.5;
  const avgQuestionsPerModule = 2;

  const totalSlides = Math.round(moduleCount * avgSlidesPerModule);
  const totalQuestions = moduleCount * avgQuestionsPerModule;

  // Estimate generation time (rough calculation)
  const slideGenerationTime = totalSlides * 30; // 30 seconds per slide
  const questionGenerationTime = totalQuestions * 15; // 15 seconds per question
  const totalSeconds = slideGenerationTime + questionGenerationTime;

  const minutes = Math.ceil(totalSeconds / 60);
  const estimatedGenerationTime = minutes > 60 ?
    `${Math.ceil(minutes / 60)} hours` :
    `${minutes} minutes`;

  return {
    totalSlides,
    totalQuestions,
    estimatedGenerationTime,
  };
}