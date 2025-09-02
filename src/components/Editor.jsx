import Chat from "./Chat";
import Code from "./Code";
import { useAI } from "../context/AIContext";

function Editor() {
  const { isProcessing } = useAI();
  return (
    <div className="bg-gray-950 min-h-screen">
      <div className="p-10 grid grid-cols-1 md:grid-cols-4 gap-10">
        <Chat />
        <div className="col-span-3 relative">
          {isProcessing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center z-10 rounded-lg">
              <div className="text-white text-2xl">Generating Code...</div>
            </div>
          )}
          <Code />
        </div>
      </div>
    </div>
  );
}

export default Editor;
