import { ThemeProvider } from "./context/ThemeContext";
import ThemeToggle from "./components/ThemeToggle";
import ParticleBackground from "./components/ParticleBackground";
import HeroSection from "./components/HeroSection";
import PresentAISection from "./components/PresentAISection";
import BenefitsSection from "./components/BenefitsSection";
import DangersSection from "./components/DangersSection";
import FutureTimelineSection from "./components/FutureTimelineSection";
import GamesManager from "./components/games/GamesManager";
import Footer from "./components/Footer";

function AppContent() {
  const scrollToGames = () => {
    document.getElementById('games-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-full min-h-screen font-sans selection:bg-primary/30 bg-white dark:bg-slate-950 transition-colors duration-300">
      <main>
        <HeroSection onStartGames={scrollToGames} />
        <PresentAISection />
        <BenefitsSection />
        <DangersSection />
        <FutureTimelineSection />
        <GamesManager />
      </main>

      <Footer onStartGames={scrollToGames} />
      <ThemeToggle />
    </div>
  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;
