import React, { useState, useEffect } from "react";
import clsx from "clsx";
import { LucideFile, LucideTrash2 } from "lucide-react";
import { usePDFJS } from "@/hooks/usePdfjs";
import { createWorker } from "tesseract.js";
import axios from "axios";

interface PDFFile {
  name: string;
  size: string;
  blobUrl: string;
  isExtracting: boolean;
  text: string;
  stage: string;

}

export default function FileInputPDF({
  onChange,
  disabled = false,
  projectName,
}: {
  onChange: (texts: string[]) => void;
  disabled?: boolean;
  projectName: string;
}) {
  const pdfjs = usePDFJS();
  const [files, setFiles] = useState<PDFFile[]>([]);
  const [queue, setQueue] = useState<PDFFile[]>([]); 
  const [isExtracting, setIsExtracting] = useState<boolean>(false);

  useEffect(() => {
    return () => {
      files.forEach((file) => URL.revokeObjectURL(file.blobUrl));
    };
  }, [files]);

  useEffect(() => {
    if (!isExtracting && queue.length > 0) {
      processNextFile();
    }
  }, [queue, isExtracting]);

  function formatFileSize(bytes: number): string {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB", "TB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
  }

  async function extractTextFromPDF(file: PDFFile) {
    setIsExtracting(true);
    setFiles((prev) =>
      prev.map((f) => (f.blobUrl === file.blobUrl ? { ...f, isExtracting: true, stage: "Starting..." } : f))
    );
  
    let extractedText = "";
  
    try {
      if (!pdfjs) return;
  
      const response = await fetch(file.blobUrl);
      const arrayBuffer = await response.arrayBuffer();  
      const pdf = await pdfjs.getDocument({ data: arrayBuffer }).promise;
      const numOfPages = pdf.numPages;
  
      const worker = await createWorker("eng", 1, {
        logger: (m) =>
          setFiles((prev) =>
            prev.map((f) => (f.blobUrl === file.blobUrl ? { ...f, stage: m.status } : f))
          ),
      });
      await worker.setParameters({ preserve_interword_spaces: "1" });
  
      for (let i = 1; i <= numOfPages; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        extractedText += textContent.items.map((item: any) => item.str).join(" ") + "\n";
      }
      console.log("extracted",extractedText)
  
      await worker.terminate();
    } catch (error) {
      console.error("Error extracting text:", error);
      extractedText = "Failed to extract text.";
    }
  
    setFiles((prev) =>
      prev.map((f) => (f.blobUrl === file.blobUrl ? { ...f, isExtracting: false, text: extractedText, stage: "" } : f))
    );
  
    setIsExtracting(false);
    setQueue((prev) => prev.slice(1)); // Remove from queue
    await storePDFTranscript(extractedText, file.name);

    onChange(files.map((f) => (f.blobUrl === file.blobUrl ? extractedText : f.text)));
  }

  
  function processNextFile() {
    if (queue.length > 0) {
      extractTextFromPDF(queue[0]);
    }
  }

  async function storePDFTranscript(transcript: string, pdfFileName: string) {
    try {
      const response = await axios.post("/api/upload", {
        transcript,
        pdfFileName,
        projectName, 
      });
  
      console.log("PDF transcript stored successfully:", response.data.message);
    } catch (error) {
      console.error("Error storing PDF transcript:", error );
    }
  }

   function handleFileUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const selectedFiles = Array.from(event.target.files || []);
    const newFiles: PDFFile[] = selectedFiles.map((file) => ({
      name: file.name,
      size: formatFileSize(file.size),
      blobUrl: URL.createObjectURL(file),
      isExtracting: false,
      text: "",
      stage: "",
    }));

    setFiles((prev) => [...prev, ...newFiles]);
    setQueue((prev) => [...prev, ...newFiles]);

    if (!isExtracting) {
      processNextFile();
    }
  }

  function removeFile(blobUrl: string) {
    setFiles((prev) => prev.filter((file) => file.blobUrl !== blobUrl));
    setQueue((prev) => prev.filter((file) => file.blobUrl !== blobUrl));
    onChange(files.filter((file) => file.blobUrl !== blobUrl).map((file) => file.text));
  }

  return (
    <div className={clsx("rounded-md border border-black/40 border-dashed w-full p-4", disabled && "opacity-50")}>
      
      <label
        htmlFor="file-upload"
        className={clsx("relative  w-full h-40 flex flex-col place-items-center justify-center cursor-pointer", disabled && "pointer-events-none")}
      >
        <LucideFile className="w-10 h-10 text-gray-400" />
        <p className="text-gray-500">Drag and drop files here or <span className="font-medium text-sky-500">click here</span> to upload</p>
        <input
          id="file-upload"
          type="file"
          accept="application/pdf"
          multiple
          disabled={disabled}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileUpload}
        />
      </label>

      {files.length > 0 && (
        <div className="mt-4 space-y-3">
          {files.map((file) => (
            <div key={file.blobUrl} className="relative p-3 border rounded-md bg-gray-100 flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <LucideFile className="w-6 h-6 text-gray-500" />
                <div className="overflow-hidden">
                  <a href={file.blobUrl} target="_blank" rel="noopener noreferrer" className="block text-sm font-medium text-sky-500 truncate hover:underline">
                    {file.name}
                  </a>
                  <p className="text-xs text-gray-500">{file.size}</p>
                  {file.isExtracting && <p className="text-xs text-gray-400">{file.stage || "Extracting..."}</p>}
                </div>
              </div>
              <button
                onClick={() => removeFile(file.blobUrl)}
                disabled={file.isExtracting}
                className="p-2 rounded-md hover:text-red-600 disabled:opacity-50"
                aria-label="Remove file"
              >
                <LucideTrash2 className="w-5 h-5" />
              </button>
            </div>
          ))}
        </div>
      )}

      <p className="mt-2 text-gray-600 text-sm">File format: <b>.pdf</b> only</p>
    </div>
  );
}
