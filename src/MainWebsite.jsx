import Navigation from './components/common/Navigation';
import Footer from './components/common/Footer';
import Hero from './components/sections/Hero';
import About from './components/sections/About';
import Projects from './components/sections/Projects';
import VisualStory from './components/sections/VisualStory';
import Impact from './components/sections/Impact';
import CarbonCalculatorPage from './pages/CarbonCalculatorPage';
import Partners from './components/sections/Partners';
import Team from './components/sections/Team'; // Kept for CSS - component hidden below
import Donate from './components/sections/Donate';
import News from './components/sections/News';
import Contact from './components/sections/Contact';

function MainWebsite() {
  return (
    <div className="app">
      <Navigation />
      <Hero />
      <About />
      <Projects />
      <VisualStory />
      <Impact />
      <CarbonCalculatorPage embedded />
      <Partners />
      {/* <Team /> */}
      <Donate />
      <News />
      <Contact />
      <Footer />
    </div>
  );
}

export default MainWebsite;

