import './App.css';
import Navbar from './components/Navbar/Navbar';
import Hero from './components/Hero/Hero';
import ScrollTransition from './components/ScrollTransition/ScrollTransition';
import Projects from './components/Projects/Projects';
import OurTeam from './components/OurTeam/OurTeam';
import Footer from './components/Footer/Footer';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <ScrollTransition />
        <Projects />
        <OurTeam />
      </main>
      <Footer />
    </div>
  );
}

export default App;
