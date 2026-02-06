"use client";

import { useState } from "react";
import { ArrowRight, Upload, FileText, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";

export default function PdfUploadPage() {
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];
    if (selectedFile && selectedFile.type === "application/pdf") {
      setFile(selectedFile);
    } else {
      alert("Please select a valid PDF file");
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) return;

    setIsLoading(true);
    
    try {
      const formData = new FormData();
      formData.append("pdf", file);

      const response = await fetch("/api/course/upload-pdf", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to process PDF");
      }

      const result = await response.json();
      router.push(`/course/create/manual?data=${encodeURIComponent(JSON.stringify(result))}`);
    } catch (error) {
      console.error("Error uploading PDF:", error);
      alert("Failed to process PDF. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">Upload PDF to Create Course</h1>
          <p className="text-base-content/70">
            Upload a PDF file and we'll extract the content to help you create a course
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="card bg-base-100 shadow-xl">
            <div className="card-body">
              <div className="flex items-center gap-3 mb-4">
                <div className="p-3 bg-primary/10 rounded-lg">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h2 className="card-title">Select PDF File</h2>
              </div>

              <div className="form-control">
                <label className="label">
                  <span className="label-text">Choose a PDF file to upload</span>
                </label>
                <input
                  type="file"
                  accept=".pdf"
                  onChange={handleFileChange}
                  className="file-input file-input-bordered w-full"
                  disabled={isLoading}
                />
                <label className="label">
                  <span className="label-text-alt">
                    Only PDF files are supported. Max size: 10MB
                  </span>
                </label>
              </div>

              {file && (
                <div className="alert alert-success mt-4">
                  <FileText className="h-4 w-4" />
                  <span>Selected: {file.name}</span>
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-between items-center">
            <button
              type="button"
              onClick={() => router.back()}
              className="btn btn-ghost"
            >
              Back
            </button>
            
            <button
              type="submit"
              disabled={!file || isLoading}
              className="btn btn-primary"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Processing PDF...
                </>
              ) : (
                <>
                  Process PDF
                  <ArrowRight className="h-4 w-4" />
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}