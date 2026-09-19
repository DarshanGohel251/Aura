"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { LearnerProfile, Accessibility, api, fallbackLearners } from "@/lib/api";

type ProfileContextType = {
  profile: LearnerProfile;
  currentPersona: LearnerProfile;
  personas: LearnerProfile[];
  setPersona: (username: string) => Promise<void>;
  updateProfile: (updates: Partial<LearnerProfile>) => Promise<void>;
  toggleAccessibility: (key: keyof Accessibility) => Promise<void>;
  isBackendConnected: boolean;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: { children: ReactNode }) {
  const [personas, setPersonas] = useState<LearnerProfile[]>(fallbackLearners);
  const [currentPersona, setCurrentPersonaState] = useState<LearnerProfile>(fallbackLearners[0]);
  const [profile, setProfile] = useState<LearnerProfile>(fallbackLearners[0]);
  const [isBackendConnected, setIsBackendConnected] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const learners = await api.getLearners();
        if (learners && learners.length > 0) {
          setPersonas(learners);
          setCurrentPersonaState(learners[0]);
          setProfile(learners[0]);
          setIsBackendConnected(true);
        }
      } catch {
        setIsBackendConnected(false);
      }
    }
    loadData();
  }, []);

  const setPersona = async (username: string) => {
    const found = personas.find((p) => p.username === username);
    if (found) {
      setCurrentPersonaState(found);
      setProfile(found);
    }
  };

  const updateProfile = async (updates: Partial<LearnerProfile>) => {
    const updated = { ...profile, ...updates };
    setProfile(updated);
    if (profile.id) {
      try {
        await api.updateProfile(profile.id, updates);
      } catch {}
    }
  };

  const toggleAccessibility = async (key: keyof Accessibility) => {
    const updatedAccessibility = {
      ...profile.accessibility,
      [key]: !profile.accessibility[key],
    };
    const updated = {
      ...profile,
      accessibility: updatedAccessibility,
    };
    setProfile(updated);
    if (profile.id) {
      try {
        await api.updateAccessibility(profile.id, updatedAccessibility);
      } catch {}
    }
  };

  return (
    <ProfileContext.Provider
      value={{
        profile,
        currentPersona,
        personas,
        setPersona,
        updateProfile,
        toggleAccessibility,
        isBackendConnected,
      }}
    >
      {children}
    </ProfileContext.Provider>
  );
}

export function useProfile() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfile must be used within a ProfileProvider");
  }
  return context;
}
