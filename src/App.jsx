// src/App.jsx
import { useEffect } from "react";
import ChatbaseWidget from "./components/ChatWidget"; 
import About from "./components/About";
import Hero from "./components/Hero";
import NavBar from "./components/Navbar";
import Features from "./components/Features";
import Contact from "./components/Contact";
import Footer from "./components/Footer";

function App() {
  useEffect(() => {
    const sections = ["home", "services", "works", "contact", "Chat"];
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const sectionId = entry.target.id;
            const capitalized = sectionId.charAt(0).toUpperCase() + sectionId.slice(1);
            document.title = `CR8 - ${capitalized}`;
          }
        });
      },
      {
        threshold: 0.5,
      }
    );
    
    sections.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    
    return () => observer.disconnect();
  }, []);

  return (
    <main className="relative min-h-screen w-screen overflow-x-hidden">
      <NavBar />
      <Hero id="home" />
      <About id="about" />
      <Features id="services" />
      <Contact id="contact" />
      <Footer />
      <ChatbaseWidget id="Chat" enabled={true} />
    </main>
  );
}

export default App;