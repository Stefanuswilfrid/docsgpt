import React from "react";
import ReactMarkdown from "react-markdown"; 

const ChatBubble = ({
  role,
  content,
  timestamp,
}: {
  role: string;
  content: string | React.JSX.Element;
  timestamp: string;
}) => {
  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  return (
    <div className={`flex items-center space-x-4 mb-4 ${role === "user" ? "justify-end" : "justify-start"}`}>
      <div
        className={`flex lg:items-center md:gap-4 gap-2 flex-col ${
          role === "user" ? "lg:flex-row" : "lg:flex-row-reverse"
        }`}
      >
        <div>
          <div
            className={`flex items-center space-x-2 px-4 py-2 rounded-xl max-w-2xl ${
              role === "user"
                ? "bg-neutral-900 text-white rounded-tr-md "
                : "bg-neutral-100 rounded-tl-md text-black flex-col "
            }`}
          >
            {/* Ensure content passed to ReactMarkdown is always a string */}
            <div className={role === "user" ? "text-white" : "text-black text-start mr-auto mb-4"}>
              {/* If content is a string, pass it directly. Otherwise, handle it appropriately */}
              {typeof content === "string" ? (
                <ReactMarkdown>{content}</ReactMarkdown>
              ) : (
                // If content is not a string, we can render it directly (assuming JSX)
                content
              )}
            </div>
          </div>
        </div>

        <p className={`text-neutral-500 text-xs ${role === "user" ? "lg:text-right" : "lg:text-left"}`}>
          {formatTimestamp(timestamp)}
        </p>
      </div>
    </div>
  );
};

export default ChatBubble;
