"use server";

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

interface MCQOption {
  text: string;
  isCorrect: boolean;
  explanation: string;
}

interface GeneratedMCQ {
  title: string;
  question: string;
  options: MCQOption[];
}

export async function generateMCQFromSlide(slideContent: string) {
  if (!process.env.GROQ_API_KEY) {
    return {
      success: false,
      error: "GROQ_API_KEY is not configured",
    };
  }

  if (!slideContent.trim()) {
    return {
      success: false,
      error: "Slide content is required",
    };
  }

  try {
    const systemPrompt = `You are an expert educational assessment creator. Generate a multiple choice question (MCQ) based on the provided slide content.

CRITICAL RULES:
- Create exactly ONE well-structured MCQ question
- The question should test understanding of the core concept from the slide
- Generate 2 to 4 options based on what's relevant to the content (don't force unnecessary options)
- Only ONE option should be correct
- Each option should have a brief explanation

OUTPUT FORMAT (JSON only, no markdown):
{
  "title": "Brief title describing the topic being tested",
  "question": "The question text asking about the slide content",
  "options": [
    { "text": "Option text", "isCorrect": false, "explanation": "Why this is wrong/right" },
    { "text": "Correct option text", "isCorrect": true, "explanation": "Why this is the correct answer" }
  ]
}

Return ONLY valid JSON, no additional text or formatting.`;

    const userPrompt = `Based on the following slide content, create an MCQ question:

${slideContent}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 1024,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return {
        success: false,
        error: "No content generated",
      };
    }

    // Parse the JSON response
    let mcqData: GeneratedMCQ;
    try {
      // Remove any potential markdown code block wrappers
      const cleanedContent = content
        .replace(/^```(?:json)?\n?/gm, "")
        .replace(/```$/gm, "")
        .trim();
      mcqData = JSON.parse(cleanedContent);
    } catch {
      return {
        success: false,
        error: "Failed to parse generated MCQ",
      };
    }

    // Validate the response structure
    if (
      !mcqData.title ||
      !mcqData.question ||
      !Array.isArray(mcqData.options) ||
      mcqData.options.length < 2
    ) {
      return {
        success: false,
        error: "Invalid MCQ structure generated",
      };
    }

    // Ensure each option has an id
    const optionsWithIds = mcqData.options.map((opt) => ({
      id: crypto.randomUUID(),
      text: opt.text,
      isCorrect: opt.isCorrect,
      explanation: opt.explanation || "",
    }));

    return {
      success: true,
      mcq: {
        title: mcqData.title,
        question: mcqData.question,
        options: optionsWithIds,
      },
    };
  } catch (error) {
    console.error("Error generating MCQ:", error);
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to generate MCQ",
    };
  }
}
