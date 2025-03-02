"use client";

import { useState, useEffect } from "react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";

import { useYouTubeManager } from "@/hooks/useYoutubeManager";
import CreateProject from "@/components/project/CreateProject";
import { Layout } from "@/components/Layout";
import PDFTool from "@/components/pdf/PDFTool";
import CreateProjectModal from "@/components/project/CreateProjectModal";

export default function YouTubeComponents() {
  const [projectName, setProjectName] = useState<string | null>(null);

  useEffect(() => {
    const storedProject = localStorage.getItem("projectName");
    if (storedProject) {
      setProjectName(storedProject);
    }
  }, []);

  const manager = useYouTubeManager(projectName);

  return (
    <Layout>
      <CreateProjectModal/>
      <div className="max-md:px-4">
        <PDFTool/>
        
      </div>
    </Layout>
  );
}
