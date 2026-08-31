// TODO:
// Chat & Image filter or Ai Edit feature
// Automatic EXIF data processing
// Real-time Updates: Live notifications and interactions
// Ai powered image search
// Complete personal analytics page

"use client";

import {
  Header,
  HeroSection,
  BenefitsSection,
  FeaturesSection,
  Footer,
} from '@/components';
import LoadingScreen from '@/components/screens/LoadingScreen';
import RunningServer from '@/components/screens/RunningServer';
import { useAuth } from '@/context/AuthContext';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

import { api } from '@/lib/api';

export default function Home() {
  const router = useRouter();
  const { loading, isAuthenticated } = useAuth();

  const [isServerRunning, setIsServerRunning] = useState(true);

  useEffect(() => {
    const checkServer = async () => {
      try {
        const response = await api.get('/');
        if (response.data === "Server is running!") {
          setIsServerRunning(true);
        }
      } catch (error) {
        // In production, keep UI alive gracefully
        setIsServerRunning(true);
      }
    };
    checkServer();
  }, []);

  useEffect(() => {
    if (!loading && isAuthenticated) {
      router.push("/dashboard");
    }
  }, [loading, isAuthenticated, router]);
  
  if (!isServerRunning) {
    return <RunningServer />;
  }

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <>
      <Header />
      <HeroSection />
      <BenefitsSection />
      <FeaturesSection />
      <Footer />
    </>
  );
}