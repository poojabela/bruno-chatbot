"use client";

import React, { useRef, useEffect, useState } from "react";
import { Search, Command, ArrowRight, User, Bot } from "lucide-react";
import ReactMarkdown from "react-markdown";
import { useChat } from "ai/react";
import { cn } from "@/app/lib/utils";

const Home: React.FC = () => {
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, input, handleInputChange, handleSubmit, isLoading } =
    useChat({
      api: "/api/search",
    });

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        document.querySelector<HTMLInputElement>('input[type="text"]')?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="flex flex-col h-screen max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-4 space-y-6">
        {messages.length === 0 && (
          <div className="text-center text-gray-500 mt-20 flex flex-col justify-center">
            <img src="logo.svg" alt="logo" className="h-14" />
            <h1 className="text-2xl font-bold mb-2">Welcome to Bruno AI</h1>
            <p>Start a conversation by typing your question below.</p>
          </div>
        )}

        {messages.map((message, index) => (
          <div
            key={index}
            className={cn(
              "flex items-start gap-4 max-w-xl",
              message.role === "user" ? "mr-auto" : "ml-auto justify-end"
            )}
          >
            <div
              className={cn(
                "w-8 h-8 rounded-full flex items-center justify-center",
                message.role === "user"
                  ? "bg-blue-500 order-2"
                  : "bg-gray-600 order-1"
              )}
            >
              {message.role === "user" ? (
                <User className="w-5 h-5 text-white" />
              ) : (
                <Bot className="w-5 h-5 text-white" />
              )}
            </div>

            {/* Message Bubble */}
            <div
              className={cn(
                "rounded-2xl px-4 py-2 max-w-lg",
                message.role === "user"
                  ? "bg-blue-500 text-white order-1"
                  : "bg-gray-100 text-gray-800 order-2"
              )}
            >
              {message.role === "assistant" ? (
                <div className="prose prose-sm">
                  <ReactMarkdown
                    components={{
                      a: ({ node, ...props }) => (
                        <a
                          {...props}
                          className="text-blue-600 hover:underline"
                          target="_blank"
                          rel="noreferrer"
                        />
                      ),
                    }}
                  >
                    {message.content}
                  </ReactMarkdown>
                </div>
              ) : (
                <p>{message.content}</p>
              )}
            </div>
          </div>
        ))}

        {isLoading && (
          <div className="flex justify-end ml-auto items-start gap-4 max-w-xl">
            <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-600">
              <Bot className="w-5 h-5 text-white" />
            </div>
            <div className="rounded-2xl bg-gray-100">
              <TypingIndicator />
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      <div className="p-4 border-t bg-white/50 backdrop-blur-sm">
        <div
          className={cn(
            "relative rounded-2xl",
            isFocused
              ? "ring-2 ring-blue-500 shadow-lg"
              : "shadow-md hover:shadow-lg",
            "transition-all duration-300 ease-in-out",
            "bg-white"
          )}
        >
          <form onSubmit={handleSubmit} className="relative">
            <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
              <Search
                className={cn(
                  "h-5 w-5 transition-colors duration-200",
                  isFocused ? "text-blue-500" : "text-gray-400"
                )}
              />
            </div>

            <input
              type="text"
              value={input}
              onChange={handleInputChange}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setIsFocused(false)}
              className={cn(
                "w-full bg-transparent pl-12 pr-32 py-4 rounded-2xl",
                "text-gray-800 placeholder-gray-400",
                "border-none outline-none",
                "transition-all duration-200",
                "text-base"
              )}
              placeholder="Ask anything..."
            />

            <div className="absolute inset-y-0 right-4 flex items-center space-x-2">
              <kbd className="hidden sm:flex items-center px-2 py-1 text-xs font-semibold text-gray-500 bg-gray-100/80 rounded-lg border border-gray-200">
                <Command className="w-3 h-3 mr-1" />
                <span>K</span>
              </kbd>

              <button
                type="submit"
                disabled={isLoading}
                className={cn(
                  "flex items-center space-x-1 px-3 py-1.5 rounded-lg",
                  "text-sm font-medium transition-colors duration-200",
                  isLoading
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : input
                    ? "bg-blue-500 text-white hover:bg-blue-600"
                    : "bg-gray-100 text-gray-400"
                )}
              >
                <span className="hidden sm:inline">
                  {isLoading ? "Thinking..." : "Send"}
                </span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Home;

const TypingIndicator = () => {
  return (
    <div className="flex items-center space-x-1 px-3 py-2">
      <div
        className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
        style={{ animationDelay: "0ms" }}
      />
      <div
        className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
        style={{ animationDelay: "200ms" }}
      />
      <div
        className="w-2 h-2 rounded-full bg-gray-400 animate-pulse"
        style={{ animationDelay: "400ms" }}
      />
    </div>
  );
};
