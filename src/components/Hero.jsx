import React, { useState } from "react";
import { useMotionTemplate, motion } from "framer-motion";
import { useColorContext } from "../context/ColorContext";
import { useNavigate } from "react-router";
import { useAI } from "../context/AIContext";
import linkedinIcon from "../assets/linkedin.png";
import githubIcon from "../assets/github.png";
import twitterIcon from "../assets/twitter.png";

function Hero() {
  const { color } = useColorContext();
  const navigate = useNavigate();
  const [userMessage, setUserMessage] = useState("");
  const [apiKey, setApiKey] = useState("");
  const [showApiKeyInput, setShowApiKeyInput] = useState(false);
  const [apiKeyError, setApiKeyError] = useState(null);
  const { initializeAI, apiKey: contextApiKey } = useAI();

  const border = useMotionTemplate`1px solid ${color}`;
  
  const handleEditorNavigation = () => {
    if (!contextApiKey) {
      setShowApiKeyInput(true);
    } else {
      navigate("/editor", { state: { userMessage } });
    }
  };
  
  const handleInputChange = (e) => {
    setUserMessage(e.target.value);
  };
  
  const toggleApiKeyInput = () => {
    setShowApiKeyInput(!showApiKeyInput);
  };
  
  const handleApiKeySubmit = () => {
    if (apiKey.trim().length > 30) {
      initializeAI(apiKey);
      setShowApiKeyInput(false);
      setApiKeyError(null);
    } else {
      setApiKeyError("Invalid API key.");
      setApiKey("");
    }
  };

  return (
    <div className="absolute inset-0 z-10 flex flex-col items-center justify-center gap-4 px-4">
      {/* API Key Input Button */}
      <button 
        onClick={toggleApiKeyInput}
        className="absolute top-4 right-4 bg-blue-600 hover:bg-blue-700 text-white py-1 px-3 rounded-md text-sm transition-colors"
      >
        Set API Key
      </button>
      
      {/* API Key Input Modal */}
      {showApiKeyInput && (
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-[#171717] border border-gray-700 rounded-lg p-6 w-96 shadow-lg">
            <h3 className="text-white text-lg font-medium mb-4">Enter your Gemini API Key</h3>
            <input 
              type="password" 
              value={apiKey}
              onChange={(e) => setApiKey(e.target.value)}
              className="w-full bg-[#2a2a2a] border border-gray-700 rounded px-3 py-2 text-white mb-4"
              placeholder="Paste your API key here"
            />
            {apiKeyError && <p className="text-red-500 text-sm mb-4">{apiKeyError}</p>}
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setShowApiKeyInput(false)}
                className="bg-gray-600 hover:bg-gray-700 text-white py-2 px-4 rounded transition-colors"
              >
                Cancel
              </button>
              <button 
                onClick={handleApiKeySubmit}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded transition-colors"
              >
                Submit
              </button>
            </div>
          </div>
        </div>
      )}
      <h1 className="text-4xl font-bold text-white text-responsive-h1">
        What do you want to build?
      </h1>
      <p className="text-lg text-gray-300 text-responsive-p">
        Create stunning apps & websites by chatting with AI.
      </p>
      <div className="w-full max-w-2xl">
        <div className="relative">
          <motion.textarea
            placeholder="Type your idea and we'll bring it to life"
            className="w-full h-44 rounded-lg bg-[#171717]/80 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm focus:outline-none resize-none"
            style={{
              border,
            }}
            value={userMessage}
            onChange={handleInputChange}
          ></motion.textarea>
          <button
            className="absolute top-3 right-3 bg-white text-black rounded p-2 hover:bg-gray-200 transition-colors disabled:opacity-50"
            aria-label="Submit"
            onClick={handleEditorNavigation}
            disabled={!userMessage.trim()}
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
      
      {/* Social Media Footer */}
      <div className="absolute bottom-6 flex items-center justify-center gap-6">
        <a href="https://www.linkedin.com/in/Towfeeqkhan/" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
          <img src={linkedinIcon} alt="LinkedIn" className="w-6 h-6" />
        </a>
        <a href="https://github.com/towfeeqkhan" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
          <img src={githubIcon} alt="GitHub" className="w-6 h-6" />
        </a>
        <a href="https://x.com/Towfeeqkhan_7" target="_blank" rel="noopener noreferrer" className="transition-transform hover:scale-110">
          <img src={twitterIcon} alt="Twitter" className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
}

export default Hero;
