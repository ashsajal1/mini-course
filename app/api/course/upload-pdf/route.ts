import { NextRequest, NextResponse } from "next/server";

// Simple PDF text extraction for server-side
async function extractSimplePDFText(buffer: Buffer): Promise<any> {
  // For now, return a placeholder structure
  // In a real implementation, you'd use a server-side PDF library
  const text = buffer.toString('utf-8', 0, Math.min(buffer.length, 1000));
  const lines = text.split('\n').filter((line: string) => line.trim().length > 0);
  
  return {
    text: text.substring(0, 5000), // Limit text length
    numpages: Math.ceil(buffer.length / 10000),
    info: {},
    metadata: {}
  };
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("pdf") as File;

    if (!file) {
      return NextResponse.json(
        { error: "No file provided" },
        { status: 400 }
      );
    }

    if (file.type !== "application/pdf") {
      return NextResponse.json(
        { error: "Only PDF files are allowed" },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File size must be less than 10MB" },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    const data = await extractSimplePDFText(buffer);

    const extractedContent = {
      text: data.text,
      pages: data.numpages,
      info: data.info,
      metadata: data.metadata,
    };

    const courseStructure = analyzePdfContent(extractedContent);

    return NextResponse.json({
      success: true,
      content: extractedContent,
      structure: courseStructure,
    });
  } catch (error) {
    console.error("Error processing PDF:", error);
    return NextResponse.json(
      { error: "Failed to process PDF file" },
      { status: 500 }
    );
  }
}



function analyzePdfContent(content: any) {
  const text = content.text;
  const lines = text.split('\n').filter((line: string) => line.trim().length > 0);
  
  const structure = {
    title: extractTitle(lines),
    modules: extractModules(lines),
    keyTopics: extractKeyTopics(text),
    estimatedDuration: estimateDuration(text),
  };

  return structure;
}

function extractTitle(lines: string[]): string {
  const firstLines = lines.slice(0, 5);
  const titleLine = firstLines.find((line: string) => 
    line.length > 10 && 
    line.length < 100 && 
    !line.toLowerCase().includes('chapter') &&
    !line.toLowerCase().includes('section') &&
    !/^\d+\./.test(line)
  );
  
  return titleLine?.trim() || "Untitled Course";
}

function extractModules(lines: string[]): Array<{title: string, content: string[]}> {
  const modules: Array<{title: string, content: string[]}> = [];
  
  const chapterRegex = /^(chapter|section|module|part)\s*\d+/i;
  const numberedRegex = /^\d+\.\s*/;
  
  let currentModule: {title: string, content: string[]} | null = null;
  
  for (const line of lines) {
    const trimmedLine = (line as string).trim();
    
    if (chapterRegex.test(trimmedLine) || numberedRegex.test(trimmedLine)) {
      if (currentModule) {
        modules.push(currentModule);
      }
      currentModule = {
        title: trimmedLine,
        content: []
      };
    } else if (currentModule && trimmedLine.length > 20) {
      currentModule.content.push(trimmedLine);
    }
  }
  
  if (currentModule) {
    modules.push(currentModule);
  }
  
  if (modules.length === 0) {
    const chunks = chunkText(lines, 5);
    chunks.forEach((chunk, index) => {
      modules.push({
        title: `Module ${index + 1}`,
        content: chunk
      });
    });
  }
  
  return modules;
}

function extractKeyTopics(text: string): string[] {
  const words = text.toLowerCase()
    .replace(/[^\w\s]/g, ' ')
    .split(/\s+/)
    .filter(word => word.length > 4);
  
  const wordCount: {[key: string]: number} = {};
  words.forEach(word => {
    wordCount[word] = (wordCount[word] || 0) + 1;
  });
  
  const topics = Object.entries(wordCount)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 10)
    .map(([word]) => word);
  
  return topics;
}

function estimateDuration(text: string): string {
  const wordCount = text.split(/\s+/).length;
  const estimatedMinutes = Math.ceil(wordCount / 200);
  const hours = Math.floor(estimatedMinutes / 60);
  const minutes = estimatedMinutes % 60;
  
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
}

function chunkText(lines: string[], chunkSize: number): string[][] {
  const chunks: string[][] = [];
  for (let i = 0; i < lines.length; i += chunkSize) {
    chunks.push(lines.slice(i, i + chunkSize));
  }
  return chunks;
}