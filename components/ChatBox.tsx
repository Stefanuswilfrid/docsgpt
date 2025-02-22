import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Send } from "lucide-react";

interface Message {
  role: "user" | "ai";
  content: string;
}

interface Props {
  query: string;
  setQuery: (query: string) => void;
  handleQuery: () => void;
  isLoading: boolean;
  messages: Message[];
}

export default function ChatBox({ query, setQuery, handleQuery, isLoading, messages }: Props) {
  return (
    <div className="space-y-4">
      <ScrollArea className="h-[400px] w-full rounded-md border p-4">
        {messages.map((message, index) => (
          <div key={index} className={`mb-4 ${message.role === "user" ? "text-right" : "text-left"}`}>
            <div className={`inline-block p-2 rounded-lg ${message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-black"}`}>
              {message.content}
            </div>
          </div>
        ))}
      </ScrollArea>
      <div className="flex space-x-2">
        <Input type="text" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Ask about the videos..." onKeyPress={(e) => e.key === "Enter" && handleQuery()} />
        <Button onClick={handleQuery} disabled={isLoading}>
          {isLoading ? "..." : <Send className="h-4 w-4" />}
        </Button>
      </div>
    </div>
  );
}
