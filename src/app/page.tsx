'use client';

import { useState, useEffect } from 'react';
import WelcomeAnimation from '@/components/home/WelcomeAnimation';
import Hero from '@/components/home/Hero';
import FeaturedProducts from '@/components/home/FeaturedProducts';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import CategoryShowcase from '@/components/home/CategoryShowcase';
import WhyUs from '@/components/home/WhyUs';

export default function HomePage() {
  const [showWelcome, setShowWelcome] = useState(true);
  const [hasVisited, setHasVisited] = useState(false);

  useEffect(() => {
    const visited = sessionStorage.getItem('gs-sport-visited');
    if (visited) {
      setShowWelcome(false);
      setHasVisited(true);
    }
  }, []);

  const handleWelcomeComplete = () => {
    setShowWelcome(false);
    sessionStorage.setItem('gs-sport-visited', 'true');
  };

  if (showWelcome && !hasVisited) {
    return <WelcomeAnimation onComplete={handleWelcomeComplete} />;
  }

  return (
    <main className="bg-zinc-950">
      <Navbar />
      <Hero />
      <CategoryShowcase />
      <FeaturedProducts />
      <WhyUs />
      <Footer />
    </main>
  );
}
