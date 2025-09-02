import { useLocation } from "react-router";
import { useState, useEffect, useRef, useCallback } from "react";
import { useAI } from "../context/AIContext";

function Chat() {
  const location = useLocation();
  const userMessage = location.state?.userMessage || "Create a Todo App";
  const [apiKey, setApiKey] = useState("");
  const [messages, setMessages] = useState([]);
  const [inputMessage, setInputMessage] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const chatContainerRef = useRef(null);

  const {
    initializeAI,
    generateContent,
    isProcessing,
    error,
    apiKey: contextApiKey,
    aiCode,
  } = useAI();

  const handleAIResponse = useCallback(
    async (prompt, isFollowUp = false) => {
      const chatHistory = messages.map((m) => `${m.type}: ${m.content}`).join("\n");

      const aiPrompt = isFollowUp
        ? `You are an AI Assistant and expert in React Development. You are having a conversation with a user about building a React application.

Here is the previous conversation:
${chatHistory}

Here is the current code in the editor:
\`\`\`jsx
${aiCode}
\`\`\`

Based on this context, please respond to the user's latest message and update the code if necessary.
The user's new message is: "${prompt}"

When providing the response, first, provide a brief explanation of the code you are about to generate in 5-8 lines. Then, separate the explanation from the code using '---CODE---'. The code should be a single file that can be rendered in a React sandbox, without any additional explanations or comments. If you are not generating code, just provide the explanation.`
        : `You are an AI Assistant and expert in React Development. Your task is to generate a single file React application based on the user's request. First, provide a brief explanation of the code you are about to generate in 5-8 lines. Then, separate the explanation from the code using '---CODE---'. The code should be a single file that can be rendered in a React sandbox App.js file, without any additional explanations or comments.


${prompt}`;

      try {
        const response = await generateContent(aiPrompt);
        if (response && response.message) {
          setMessages((prev) => [...prev, { type: "ai", content: response.message }]);
        } else if (error) {
          console.error("AI Error:", error);
          setMessages((prev) => [...prev, { type: "ai", content: `Error: ${error}` }]);
        }
      } catch (err) {
        console.error("Error getting AI response:", err);
        setMessages((prev) => [...prev, { type: "ai", content: `Error: ${err.message}` }]);
      }
    },
    [generateContent, error, messages, aiCode]
  );

  // Effect to set the initial user message
  useEffect(() => {
    if (userMessage && messages.length === 0) {
      setMessages([{ type: "user", content: userMessage }]);
    }
  }, [userMessage, messages]);

  // Effect to trigger the AI response
  useEffect(() => {
    const userMessageExists = messages.some((m) => m.type === "user");
    const aiResponseExists = messages.some((m) => m.type === "ai");

    if (userMessageExists && !aiResponseExists && (apiKey || contextApiKey)) {
      const userMsg = messages.find((m) => m.type === "user").content;
      handleAIResponse(userMsg, false);
    }
  }, [messages, apiKey, contextApiKey, handleAIResponse]);

  const handleApiKeySubmit = () => {
    if (apiKey.trim()) {
      const success = initializeAI(apiKey);
      if (success) {
        setShowApiKeyInput(false);
      }
    }
  };

  const handleSubmit = async () => {
    if (!inputMessage.trim()) return;

    // Add user message to chat
    const newMessage = { type: "user", content: inputMessage };
    setMessages((prev) => [...prev, newMessage]);

    // Clear input
    setInputMessage("");

    // Get AI response
    await handleAIResponse(inputMessage, true);
  };

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

  return (
    <div className="relative h-[89vh] flex flex-col">
      <div className="user-message flex-1 text-white overflow-y-auto custom-scrollbar" ref={chatContainerRef}>
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex items-start gap-3 bg-[#171717] p-3 rounded-lg mb-2 ${
              message.type === "ai" ? "border-l-2 border-green-500" : ""
            }`}
          >
            <div
              className={`flex justify-center items-center flex-shrink-0 rounded-full w-7 h-7 ${
                message.type === "user" ? "bg-blue-500/40" : "bg-green-500/40"
              }`}
            >
              {message.type === "user" ? "U" : "AI"}
            </div>
            <div className="flex-1">
              <p className="whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        {isProcessing && (
          <div className="flex items-center gap-3 bg-[#171717] p-3 rounded-lg mb-2">
            <div className="flex justify-center items-center flex-shrink-0 bg-green-500/40 rounded-full w-7 h-7">
              AI
            </div>
            <p className="text-gray-400">Thinking...</p>
          </div>
        )}
      </div>

      {/* Input Section */}
      <div className="w-full">
        <div className="relative">
          <textarea
            className="w-full h-44 rounded-lg bg-[#171717] px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none resize-none"
            placeholder="Type your message here..."
            value={inputMessage}
            onChange={(e) => setInputMessage(e.target.value)}
            disabled={showApiKeyInput || isProcessing}
          ></textarea>
          <button
            className="absolute top-3 right-3 bg-white text-black rounded p-2 hover:bg-gray-200 transition-colors disabled:opacity-50 disabled:hover:bg-white"
            aria-label="Submit"
            onClick={handleSubmit}
            disabled={showApiKeyInput || isProcessing || !inputMessage.trim()}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z"
                clipRule="evenodd"
              />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
}

export default Chat;
