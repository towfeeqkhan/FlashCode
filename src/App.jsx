import Aurora from "./components/Aurora";
import Header from "./components/Header";
import Hero from "./components/Hero";
import { ColorProvider } from "./context/ColorContext";

function App() {
  return (
    <ColorProvider>
      <div className="relative min-h-screen">
        <Header />
        <Hero />
        <Aurora />
      </div>
    </ColorProvider>
  );
}

export default App;
