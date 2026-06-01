import ParticleBackground from "./components/ParticleBackground";
import HeroSection from "./components/HeroSection";
import PresentAISection from "./components/PresentAISection";
import BenefitsSection from "./components/BenefitsSection";
import DangersSection from "./components/DangersSection";
import FutureTimelineSection from "./components/FutureTimelineSection";
import QuizManager from "./components/quiz/QuizManager";
import Footer from "./components/Footer";

function App() {
  const scrollToQuiz = () => {
    document.getElementById('quiz-section').scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="relative w-full min-h-screen font-sans selection:bg-primary/30">
      <ParticleBackground />
      
      <main>
        <HeroSection onStartQuiz={scrollToQuiz} />
        <PresentAISection />
        <BenefitsSection />
        <DangersSection />
        <FutureTimelineSection />
        <QuizManager />
      </main>

      <Footer onStartQuiz={scrollToQuiz} />
    </div>
  );
}

export default App;
