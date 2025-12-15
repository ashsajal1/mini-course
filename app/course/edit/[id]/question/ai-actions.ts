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
    const systemPrompt = `You are an expert educational assessment designer. Create high-quality multiple choice questions that effectively test learning and understanding.

QUESTION DESIGN PRINCIPLES:
- **Cognitive Levels**: Create questions that test analysis, application, and critical thinking (not just recall)
- **Distractors**: Wrong answers should be plausible and based on common misconceptions
- **Clarity**: Questions should be unambiguous and well-written
- **Relevance**: Questions should test the most important concepts from the content
- **Educational Value**: Include explanations that teach, not just state right/wrong

QUESTION TYPES TO CONSIDER:
- **Conceptual Understanding**: Test comprehension of key ideas
- **Application**: Test ability to apply concepts to new situations
- **Analysis**: Test ability to break down complex ideas
- **Problem-Solving**: Test practical application of knowledge
- **Critical Thinking**: Test evaluation and synthesis of ideas

OPTIONS GUIDELINES:
- Create 3-4 options (never 2 - that's too easy)
- One clearly correct answer
- Wrong answers should be based on real mistakes students make
- All options should be similar in length and style
- Avoid absolute terms like "always" or "never" unless truly accurate

EXPLANATIONS:
- Correct answer: Explain WHY it's right and reinforce the concept
- Wrong answers: Explain WHY it's wrong and address the misconception
- Use explanations to teach additional context and learning

OUTPUT FORMAT (JSON only, no markdown):
{
  "title": "Descriptive title of what the question tests (e.g., 'Understanding React Hooks', 'Database Normalization Principles')",
  "question": "Clear, well-written question that tests understanding (not just recall)",
  "options": [
    {
      "text": "Option text that could plausibly be correct",
      "isCorrect": false,
      "explanation": "Educational explanation of why this is incorrect and what the misconception is"
    },
    {
      "text": "The correct option text",
      "isCorrect": true,
      "explanation": "Explanation of why this is correct and reinforcement of the key concept"
    }
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
