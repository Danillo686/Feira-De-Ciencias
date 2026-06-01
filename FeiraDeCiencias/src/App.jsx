import ParticleBackground from "./components/ParticleBackground";
import HeroSection from "./components/HeroSection";
import PresentAISection from "./components/PresentAISection";
import BenefitsSection from "./components/BenefitsSection";
import DangersSection from "./components/DangersSection";
import FutureTimelineSection from "./components/FutureTimelineSection";
import GamesManager from "./components/games/GamesManager";
import Footer from "./components/Footer";

function App() {
  const scrollToGames = () => {
    document.getElementById('games-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-full min-h-screen font-sans selection:bg-primary/30">
      
      <main>
        <HeroSection onStartGames={scrollToGames} />
        <PresentAISection />
        <BenefitsSection />
        <DangersSection />
        <FutureTimelineSection />
        <GamesManager />
      </main>

      <Footer onStartGames={scrollToGames} />
    </div>
  );
}

export default App;
