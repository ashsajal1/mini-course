"use server"

import Groq from "groq-sdk";

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
 * Generates a course outline from a document URL
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
    const systemPrompt = `Analyze the document URL and create a course outline.

Requirements:
- 3-6 modules with logical progression
- Specific, measurable learning objectives
- Realistic time estimates
- Difficulty: Beginner/Intermediate/Advanced
- Language matches document (default: English)

Return ONLY valid JSON:
{
  "title": "Course title",
  "description": "2-3 sentence description",
  "difficulty": "Beginner|Intermediate|Advanced",
  "language": "Language code",
  "modules": [
    {
      "title": "Module title",
      "description": "Module description",
      "learningObjectives": ["Objective 1", "Objective 2"],
      "order": 1
    }
  ]
}`;

    const userPrompt = `Create a course outline from this document: ${url}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "compound-beta", // Use compound-beta for URL fetching
      temperature: 0.7,
      max_tokens: 4096, // Reduced to prevent overly large outlines
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return {
        success: false,
        error: "No content generated from AI",
      };
    }

    // Parse the JSON response
    let outlineData: CourseOutline;
    try {
      // Remove any potential markdown code block wrappers
      const cleanedContent = content
        .replace(/^```(?:json)?\n?/gm, "")
        .replace(/```$/gm, "")
        .trim();
      outlineData = JSON.parse(cleanedContent);
    } catch (parseError) {
      console.error("Failed to parse outline JSON:", parseError);
      console.error("Raw content:", content);
      return {
        success: false,
        error: "Failed to parse generated outline",
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