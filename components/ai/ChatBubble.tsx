import { useMemo, useState } from "react";


const ChatBubble = ({ role, content, timestamp }: { role: string; content: string; timestamp: string }) => {
  const memoizedContent = useMemo(() => [content], [content]);


  const audioPlaying = "playing";

  const formatText = (inputText: string) => {
    const parts = inputText.split(/(\*\*.*?\*\*)/g);

    return parts.map((part, index) => {
      if (part.startsWith("**") && part.endsWith("**")) {
        return <strong key={index}>{part.slice(2, -2)}</strong>;
      }
      return <span key={index}>{part}</span>;
    });
  };

  const extractAccounts = (inputText: string) => {
    const regex = /\*\*@(.*?)\*\*/g;
    const matches = [];
    let match;
    while ((match = regex.exec(inputText)) !== null) {
      matches.push(match[1]);
    }

    return matches;
  };

  const accounts = extractAccounts(content);

  return (
    <div className={"flex items-center space-x-4 mb-4 " + (role === "user" ? "justify-end" : "justify-start")}>
      <div
        className={
          "flex lg:items-center md:gap-4 gap-2 flex-col " + (role === "user" ? "lg:flex-row" : "lg:flex-row-reverse")
        }
      >
        <div>
          <div
            className={
              "flex items-center space-x-2 px-4 py-2 rounded-xl max-w-2xl " +
              (role === "user"
                ? "bg-neutral-900 text-white rounded-tr-md "
                : "bg-neutral-100 rounded-tl-md text-black flex-col ")
            }
          >
            <p className={role === "user" ? "text-white" : "text-black text-start mr-auto mb-4"}>
              {formatText(content)}
            </p>
          </div>

          {role === "system" && content !== "Unauthorized" && (
            <div className={"flex item gap-2 mt-2 " + (audioPlaying ? "opacity-50 cursor-not-allowed" : "")}>

            </div>
          )}

          {accounts.length > 0 && (
            <div className="mt-2 space-y-1">
              <p className="text-neutral-500 text-xs">Mentioned accounts:</p>
              <ul className="list-disc ml-4 space-y-1">
                {accounts.map((account, index) => (
                  <li key={account + index}>
                    <a
                      className="hover:underline underline-offset-2"
                      target="_blank"
                      href={`https://www.tiktok.com/@${account}`}
                    >
                      {account}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
        <p className={"text-neutral-500 text-xs " + (role === "user" ? "lg:text-right" : "lg:text-left")}>
          {new Date(timestamp).toLocaleTimeString([], { hour: "numeric", minute: "2-digit" })}
        </p>
      </div>
    </div>
  );
};
export default ChatBubble;
