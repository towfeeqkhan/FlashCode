import {
  SandpackProvider,
  SandpackLayout,
  SandpackCodeEditor,
  SandpackFileExplorer,
  SandpackPreview,
} from "@codesandbox/sandpack-react";
import { useAI } from "../context/AIContext";
import { useState, useEffect } from "react";

function Code() {
  const { aiCode } = useAI();
  const [activeTab, setActiveTab] = useState("code");
  const [sandpackKey, setSandpackKey] = useState(0);
  const [files, setFiles] = useState({
    "/App.js": `export default function App() {
  return <h1>Hello World</h1>;
}`,
  });

  useEffect(() => {
    if (aiCode) {
      setFiles({
        "/App.js": aiCode,
      });
      setSandpackKey(prevKey => prevKey + 1);
    }
  }, [aiCode]);

  return (
    <div>
      <div className=" bg-[#181818] w-full p-2 border">
        <div className="text-white flex justify-center items-center flex-wrap shrink-0 bg-black p-1 w-[150px] gap-3 rounded-full">
          <h2
            onClick={() => setActiveTab("code")}
            className={`text-sm cursor-pointer ${
              activeTab === "code"
                ? "text-blue-500 bg-blue-500/25 py-1 px-3 rounded-full"
                : ""
            }`}
          >
            Code
          </h2>
          <h2
            onClick={() => {
              setActiveTab("preview");
              setSandpackKey(prevKey => prevKey + 1);
            }}
            className={`text-sm cursor-pointer ${
              activeTab === "preview"
                ? "text-blue-500 bg-blue-500/25 py-1 px-3 rounded-full"
                : ""
            }`}
          >
            Preview
          </h2>
        </div>
      </div>
      <SandpackProvider template="react" theme={"dark"} files={files} key={sandpackKey}>
        <SandpackLayout>
          {activeTab === "code" ? (
            <>
              <SandpackFileExplorer style={{ height: "80vh" }} />
              <SandpackCodeEditor style={{ height: "80vh" }} />
            </>
          ) : (
            <>
              <SandpackPreview
                style={{ height: "80vh" }}
                showNavigator={true}
              />
            </>
          )}
        </SandpackLayout>
      </SandpackProvider>
    </div>
  );
}

export default Code;
