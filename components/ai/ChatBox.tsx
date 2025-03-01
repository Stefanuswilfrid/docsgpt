import { Send } from "lucide-react";
import React, { useCallback, useRef, useState, useEffect } from "react";
import ChatBubble from "./ChatBubble";
import axios from "axios";
import useProjectStore from "@/store/useProjectStore";
import ReactMarkdown from "react-markdown";

interface Message {
  role: string;
  content: string;
  timestamp: string;
}

export default function ChatUI() {
  const chatInput = useRef<HTMLInputElement>(null);
  const [generatedText, setGeneratedText] = useState<string[]>([]);
  const chatWrapper = useRef<HTMLDivElement>(null);

  const [loading, setLoading] = useState<boolean>(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [pdf, setPdf] = useState<string | null>(null); // To store the PDF (base64 string)

  const [query, setQuery] = useState<string>("");  // To store the user query
  const { projectName } = useProjectStore();

  // Load messages and PDF from localStorage on component mount
  useEffect(() => {
    if (projectName) {
      const storedMessages = localStorage.getItem(`${projectName}-messages`);
      const storedPDF = localStorage.getItem(`${projectName}-pdf`);

      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }

      if (storedPDF) {
        setPdf(storedPDF);
      }
    }
  }, [projectName]);

  const sendToAI = useCallback(async () => {
    const input = chatInput.current!.value;
    if (input === "") return;
    setLoading(true);

    chatInput.current!.value = "";
    const newMessage = { role: "user", content: input, timestamp: new Date().toISOString() };
    setMessages((prevMessages) => {
      const updatedMessages = [...prevMessages, newMessage];
      if (projectName) {
        localStorage.setItem(`${projectName}-messages`, JSON.stringify(updatedMessages)); // Save messages to localStorage
      }
      return updatedMessages;
    });

    try {
      const response = await axios.post("/api/send", {
        query: input,  // Pass the query input from the user
        projectName: projectName,  // Pass the project name
      });

      const aiMessage = response.data.response;  // Assuming 'response' is the AI's reply

      setMessages((prevMessages) => {
        const updatedMessages = [
          ...prevMessages,
          { role: "system", content: aiMessage, timestamp: new Date().toISOString() },
        ];
        if (projectName) {
          localStorage.setItem(`${projectName}-messages`, JSON.stringify(updatedMessages)); // Save messages to localStorage
        }
        return updatedMessages;
      });
    } catch (error) {
      console.error("Error fetching data from server.", error);
    }
    setGeneratedText([]);
    setLoading(false);
  }, [messages, setMessages, setGeneratedText, projectName]);

  // Scroll to the bottom when messages change
  useEffect(() => {
    if (chatWrapper.current) {
      chatWrapper.current.scrollTop = chatWrapper.current.scrollHeight;
    }
  }, [messages]);



  return (
    <section className="w-full h-full flex-col items-center justify-between px-8 pt-12 pb-0">
      <form
        className="w-full lg:max-w-xl mx-auto sticky lg:top-[90vh] top-[80vh] md:mb-16 shadow-lg rounded-full mb-4 lg:mb-8"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          ref={chatInput}
          disabled={loading}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              sendToAI();
            }
          }}
          type="text"
          placeholder="Ask Me"
          className={`w-full placeholder:text-neutral-400 relative pr-20 truncate disabled:cursor-not-allowed outline-0 transition-all outline-offset-1 px-6 py-3 rounded-full bg-white border border-neutral-200 focus:border-neutral-300 ${
            loading ? "opacity-50" : ""
          }`}
        />
      </form>


      <div
        className="w-full mb-8 md:-mt-24 md:pb-72 lg:pb-24 pb-72 overflow-y-auto max-h-[70vh] scrollbar-thin scrollbar-thumb-gray-400"
        ref={chatWrapper}
      >
        {messages.map((message, index) => (
          <ChatBubble
            key={index}
            role={message.role}
            content={
              message.role === "user" ? (
                message.content
              ) : (
                <ReactMarkdown
                  components={{
                    p: ({ node, ...props }) => <div {...props} />,
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              )
            }
            timestamp={message.timestamp}
          />
        ))}
        {loading && (
          <ChatBubble
            key={messages.length}
            role="system"
            content={
              generatedText.map((text) => text).join("") === ""
                ? "..."
                : generatedText.map((text) => text).join("")
            }
            timestamp={new Date().toISOString()}
          />
        )}
      </div>
    </section>
  );
}
