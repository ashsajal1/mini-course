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
    const systemPrompt = `You are an expert course designer and educational content creator. Your task is to analyze a document URL and create a comprehensive course outline.

CRITICAL REQUIREMENTS:
- Analyze the provided document content thoroughly
- Create a structured course with logical module progression
- Ensure learning objectives are specific and measurable
- Estimate realistic time durations for each module
- Generate 3-8 modules depending on document complexity
- Difficulty should be: Beginner, Intermediate, or Advanced
- Language should match document language (default: English)

OUTPUT FORMAT (JSON only):
{
  "title": "Clear, engaging course title",
  "description": "Brief but comprehensive course description (2-3 sentences)",
  "difficulty": "Beginner|Intermediate|Advanced",
  "estimatedDuration": "Total course duration (e.g., '4 hours', '2 weeks')",
  "language": "Language code (e.g., 'en', 'es', 'fr')",
  "modules": [
    {
      "title": "Module Title",
      "description": "Module description and what students will learn",
      "learningObjectives": [
        "Specific learning objective 1",
        "Specific learning objective 2",
        "Specific learning objective 3"
      ],
      "estimatedDuration": "Time for this module (e.g., '30 minutes', '2 hours')",
      "order": 1
    }
  ]
}

Ensure the course flows logically from basic to advanced concepts.
Return ONLY valid JSON, no additional text or formatting.`;

    const userPrompt = `Please analyze the document at this URL and create a comprehensive course outline: ${url}

Focus on:
- Educational value and learning progression
- Practical, applicable knowledge
- Clear module boundaries
- Realistic time estimates`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "compound-beta", // Use compound-beta for URL fetching
      temperature: 0.7,
      max_tokens: 4096,
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
 * Validates if a URL is properly formatted and supported
 */
function isValidUrl(url: string): boolean {
  try {
    const urlObj = new URL(url);

    // Check for supported protocols
    if (!['http:', 'https:'].includes(urlObj.protocol)) {
      return false;
    }

    // Check for supported domains (can expand this list)
    const supportedDomains = [
      'docs.google.com',
      'drive.google.com',
      'github.com',
      'medium.com',
      'notion.so',
      'readthedocs.io',
      'developer.mozilla.org',
      'stackoverflow.com',
      'wikipedia.org',
      'coursera.org',
      'udemy.com',
      'edX.org'
    ];

    const hostname = urlObj.hostname.toLowerCase();
    const isSupported = supportedDomains.some(domain =>
      hostname === domain || hostname.endsWith('.' + domain)
    );

    return isSupported;
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