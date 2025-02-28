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

    // <div className="container mx-auto space-x-4 p-4 text-center">
    //   <h1 className="text-2xl font-bold mb-2">YouTube AI Project</h1>
    //   {projectName && <p className="text-lg font-semibold text-gray-600">Project: {projectName}</p>}

    //   <CreateProject setProjectName={setProjectName} />

    //   <div className="md:flex gap-6 mt-4">
    //     <Card className="w-full md:w-1/3">
    //       <CardHeader>
    //         <CardTitle>Index YouTube Videos</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <VideoInput {...manager} />
    //         <VideoList videos={manager.videos} />
    //       </CardContent>
    //     </Card>

    //     <Card className="w-full md:w-2/3">
    //       <CardHeader>
    //         <CardTitle>Chat with AI about Videos</CardTitle>
    //       </CardHeader>
    //       <CardContent>
    //         <ChatBox {...manager} />
    //       </CardContent>
    //     </Card>
    //   </div>
    // </div>
  );
}
