import {
  createContext,
  useContext,
  useState,
  useMemo,
  useCallback,
} from "react";
import { GoogleGenAI } from "@google/genai";

const AIContext = createContext();

// Define useAI hook as a named function declaration for Fast Refresh compatibility
export function useAI() {
  return useContext(AIContext);
}

export function AIProvider({ children }) {
  const [apiKey, setApiKey] = useState("");
  const [aiClient, setAiClient] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [aiMessage, setAiMessage] = useState("");
  const [aiCode, setAiCode] = useState("");
  const [error, setError] = useState(null);

  const initializeAI = useCallback((key) => {
    try {
      setApiKey(key);
      const genAI = new GoogleGenAI({
        apiKey: key,
        apiVersion: "v1",
      });
      setAiClient(genAI);
      setError(null);
      return true;
    } catch (err) {
      setError("Failed to initialize AI client");
      return false;
    }
  }, []);

  const generateContent = useCallback(
    async (prompt) => {
      if (!aiClient) {
        setError("AI client not initialized. Please set your API key first.");
        return null;
      }

      setIsProcessing(true);
      setError(null);

      try {
        const result = await aiClient.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

        const text = result.text;

        // Split the response into message and code
        const parts = text.split("---CODE---");
        const message = parts[0]
          ? parts[0].trim()
          : "I have generated the code for you. You can view it in the editor and see the preview.";
        const code = parts[1]
          ? parts[1].trim().replace(/```jsx\n|```/g, "")
          : "";

        setAiMessage(message);
        setAiCode(code);

        setIsProcessing(false);
        return { message, code };
      } catch (err) {
        setError(`Error generating content: ${err.message}`);
        setIsProcessing(false);
        return null;
      }
    },
    [aiClient]
  );

  const value = useMemo(
    () => ({
      apiKey,
      isProcessing,
      aiMessage,
      aiCode,
      error,
      initializeAI,
      generateContent,
    }),
    [
      apiKey,
      isProcessing,
      aiMessage,
      aiCode,
      error,
      initializeAI,
      generateContent,
    ]
  );

  return <AIContext.Provider value={value}>{children}</AIContext.Provider>;
}
