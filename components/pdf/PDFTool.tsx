import React from "react";
import { Layout } from "../Layout";
import { cn } from "@/lib/utils";
import FileInputPDF from "./FileInputPDF";
import useProjectStore from "@/store/useProjectStore";
import ChatUI from "../ai/ChatBox";

export default function PDFTool() {
  const { projectName } = useProjectStore();

  const [pdfBlobUrl, setPdfBlobUrl] = React.useState<string | null>(null);
  const [loadingState, setLoadingState] = React.useState({
    loading: false,
    percentage: 0,
  });
  return (
    <Layout>
      <div className="mt-4 px-2 md:px-4 flex items-center justify-between">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold">Chat with PDF</h1>
          <p className="mt-1 text-gray-400">Project Name : {projectName} </p>
        </div>

        <div>
          <button
            onClick={()=>{}}
            type="submit"
            className="block bg-zinc-100 rounded-md font-medium duration-200 bg-hovered active:bg-subtle px-4 py-2"
          >
            Create a New Project
          </button>{" "}
        </div>
      </div>
      <div className="mt-4">
        <div className="mt-3 grid md:grid-cols-2 gap-4 md:min-h-[calc(100dvh-320px)]">
          <FileInputPDF
            projectName={projectName}
            disabled={loadingState.loading}
            onChange={(url) => {
              setPdfBlobUrl(url);
            }}
          />
          <div className="max-md:mt-6 gap-4 md:flex md:flex-col">
            <div className="h-full relative rounded-md border border-gray-500 border-dashed p-2">
              <div className="h-full overflow-x-auto overflow-y-hidden scrollbar">
                <div
                  className={cn(loadingState.loading && "opacity-50", "h-full")}
                >
                  <ChatUI />
                </div>
              </div>
              {loadingState.loading && (
                <p className="text-secondary absolute inset-0 w-full h-full grid place-items-center">
                  Loading... {loadingState.percentage}%
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
