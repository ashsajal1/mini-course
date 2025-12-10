"use server";

import Groq from "groq-sdk";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function generateSlideContent(prompt: string, docs?: string) {
  if (!process.env.GROQ_API_KEY) {
    return {
      success: false,
      error: "GROQ_API_KEY is not configured",
    };
  }

  try {
    const systemPrompt = `You are an expert course content creator. Generate educational slide content in Markdown format.
Your slides should be:
- Clear and concise
- Well-structured with proper headings
- Include code examples when relevant (with proper syntax highlighting)
- Use bullet points for key concepts
- Engaging and easy to understand

Output ONLY the markdown content for the slide, nothing else.`;

    const userPrompt = docs
      ? `Based on the following documentation/context:\n\n${docs}\n\nCreate a slide about: ${prompt}`
      : `Create a slide about: ${prompt}`;

    const completion = await groq.chat.completions.create({
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      model: "llama-3.3-70b-versatile",
      temperature: 0.7,
      max_tokens: 2048,
    });

    const content = completion.choices[0]?.message?.content;

    if (!content) {
      return {
        success: false,
        error: "No content generated",
      };
    }

    return {
      success: true,
      content,
    };
  } catch (error) {
    console.error("Error generating slide content:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate content",
    };
  }
}
