"use client";
import { useEffect, useState } from "react";
import * as PDFJS from "pdfjs-dist/types/src/pdf";

export const usePDFJS = () => {
  const [pdfjs, setPDFJS] = useState<typeof PDFJS>();

  useEffect(() => {
    import("pdfjs-dist/webpack.mjs").then(setPDFJS);
  }, []);

  return pdfjs;
};
