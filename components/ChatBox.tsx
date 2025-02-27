
import { Send } from "lucide-react";
import React, { useCallback, useRef, useState } from "react";
import ChatBubble from "./ChatBubble";

interface Message {
  role: string;
  content: string;
  timestamp: string;
}

const decoder = new TextDecoder();

export default function AiPage() {
  const chatInput = useRef<HTMLInputElement>(null);
  const [generatedText, setGeneratedText] = useState<string[]>([]);
  const chatWrapper = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);

  // {
  //   role: "user",
  //   content: "heyyyyyyyy",
  //   timestamp: new Date().toISOString(),
  // },
  // {
  //   role: "system",
  //   content: "response from ai",
  //   timestamp: new Date().toISOString(),
  // },

  const sendToAI = useCallback(async () => {
    const input = chatInput.current!.value;
    if (input === "") return;
    setLoading(true);

    chatInput.current!.value = "";
    setMessages([...messages, { role: "user", content: input, timestamp: new Date().toISOString() }]);

    try {
      const response = await fetch("/api/text", {
        method: "POST",
        headers: {
          Accept: "text/plain",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [
            ...messages.map((message) => ({
              role: message.role,
              content: message.content,
            })),
            {
              role: "user",
              content: input,
            },
          ],
        }),
      });
      const reader = response.body!.getReader();

      let done = false;
      let text = "";

      while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;
        if (value) {
          const data = decoder.decode(value);
          setGeneratedText((prev) => [...prev, data]);
          text += data;

          if (chatWrapper.current)
            window.scrollTo({
              top: chatWrapper.current.scrollHeight - window.innerHeight,
              behavior: "smooth",
            });
        }
      }

      setMessages((prev) => [
        ...prev,
        {
          role: "system",
          content: text,
          timestamp: new Date().toISOString(),
        },
      ]);
    } catch (error) {
      console.error("Error fetching data from server.", error);
    }
    setGeneratedText([]);
    setLoading(false);
  }, [messages, setMessages, setGeneratedText]);

  return (

      <section className="w-full h-full  flex-col items-center justify-between px-8 pt-12 pb-0">
        <form
          className="w-full lg:max-w-xl mx-auto sticky z-40 lg:top-[90vh] top-[80vh] md:mb-16 shadow-lg rounded-full mb-4 lg:mb-8"
          onSubmit={(e) => e.preventDefault()}
        >
          <input
            ref={chatInput}
            disabled={loading || (messages.length > 0 && messages[messages.length - 1].content === "Unauthorized")}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                sendToAI();
              }
            }}
            type="text"
            placeholder={"Ask Me"}
            className={
              "w-full placeholder:text-neutral-400 relative pr-20 truncate top-[1px] disabled:cursor-not-allowed outline-0 transition-all outline-offset-1 px-6 py-3 rounded-full bg-white border border-neutral-200 focus:border-neutral-300" +
              +(loading ? " opacity-50 pointer-events-none" : "")
            }
          />

        </form>
        <div className="w-full mb-8 md:-mt-24 md:pb-72 lg:pb-24 pb-72" ref={chatWrapper}>
          {messages.length === 0 && (
            <div className="bg-[url('/images/empty-chat.png')]  opacity-40  bg-no-repeat top-56 max-w-[400px] mx-auto bg-contain absolute inset-0" />
          )}
          {messages.map((message, index) => (
            <ChatBubble key={index} role={message.role} content={message.content} timestamp={message.timestamp} />
          ))}
          {loading && (
            <ChatBubble
              key={messages.length}
              role="system"
              content={
                generatedText.map((text) => text).join("") === "" ? "..." : generatedText.map((text) => text).join("")
              }
              timestamp={new Date().toISOString()}
            />
          )}
        </div>
      </section>
  );
}
