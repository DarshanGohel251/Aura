export interface Accessibility {
  dyslexiaFriendly: boolean;
  highContrast: boolean;
  largeText: boolean;
  increasedSpacing: boolean;
  reducedMotion: boolean;
  focusMode: boolean;
}

export interface LearnerProfile {
  id?: number;
  username: string;
  displayName: string;
  timeAvailable: "2m" | "5m" | "10m";
  preference: "VISUAL" | "READING" | "PRACTICE";
  focusLevel: "LOW" | "MEDIUM" | "HIGH";
  confidence: number;
  accessibility: Accessibility;
}

export interface Concept {
  id: string;
  orderIndex: number;
  title: string;
  technicalExplanation: string;
  analogyExplanation: string;
  stepByStepExplanation: string;
  shortSummary: string;
  visualDiagramLabel: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  hint: string;
  explanation: string;
}

export interface Lesson {
  id: string;
  title: string;
  subject: string;
  description: string;
  estimatedMinutes: number;
  difficulty: string;
  concepts?: Concept[];
}

export interface AdaptationDecision {
  adaptationType: string;
  previousValue: string;
  newValue: string;
  reason: string;
  timestamp: string;
}

export interface AdaptationPlan {
  layout: "VISUAL" | "READING" | "PRACTICE";
  conceptCount: number;
  estimatedMinutes: number;
  fontScale: number;
  spacing: string;
  interactionStyle: string;
  motion: string;
  contrastMode: string;
  explanationStrategy: "TECHNICAL" | "ANALOGY" | "STEP_BY_STEP";
  dyslexiaFriendly: boolean;
  focusMode: boolean;
  decisions: AdaptationDecision[];
  humanReadableExplanations: string[];
}

export interface LearningSession {
  id: string;
  learnerProfileId: number;
  lessonId: string;
  lessonTitle: string;
  startTime: string;
  endTime?: string;
  completed: boolean;
  currentConceptIndex: number;
  activeLayout: "VISUAL" | "READING" | "PRACTICE";
  activeExplanationStrategy: "TECHNICAL" | "ANALOGY" | "STEP_BY_STEP";
  activeTimePreference: "2m" | "5m" | "10m";
  activeFocusLevel: "LOW" | "MEDIUM" | "HIGH";
  activeAccessibility: Accessibility;
  confidenceRating: number;
  totalAdaptations: number;
  adaptationPlan: AdaptationPlan;
  concepts: Concept[];
}

export interface ImpactSimulation {
  fixedCompletionRate: number;
  adaptiveCompletionRate: number;
  accessibilityEngagement: number;
  repeatSessionRate: number;
  estimatedTotalLearningMinutes: number;
  cohortSize: number;
  simulationNotice: string;
}

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api/v1";

// Resilient fetch with timeout
async function fetchWithTimeout(url: string, options: RequestInit = {}, timeoutMs = 2500): Promise<Response> {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

export const api = {
  async checkHealth(): Promise<{ api: string; database: string; adaptationEngine: string; eventStream: string; isFallback?: boolean }> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/health`, { cache: "no-store" }, 1500);
      if (res.ok) {
        const data = await res.json();
        return {
          api: data.api || "UP",
          database: data.database || "UP",
          adaptationEngine: data.adaptationEngine || "UP",
          eventStream: data.eventStream || "UP",
          isFallback: false,
        };
      }
    } catch {
      // offline fallback status
    }
    return {
      api: "STANDBY",
      database: "STANDBY",
      adaptationEngine: "ACTIVE (LOCAL)",
      eventStream: "READY",
      isFallback: true,
    };
  },

  async getLearners(): Promise<LearnerProfile[]> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/learners`);
      if (res.ok) return await res.json();
    } catch {}
    return fallbackLearners;
  },

  async getLearner(id: number): Promise<LearnerProfile> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/learners/${id}`);
      if (res.ok) return await res.json();
    } catch {}
    return fallbackLearners[0];
  },

  async updateProfile(id: number, profile: Partial<LearnerProfile>): Promise<LearnerProfile> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/learners/${id}/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(profile),
      });
      if (res.ok) return await res.json();
    } catch {}
    return { ...fallbackLearners[0], ...profile } as LearnerProfile;
  },

  async updateAccessibility(id: number, accessibility: Accessibility): Promise<LearnerProfile> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/learners/${id}/accessibility`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(accessibility),
      });
      if (res.ok) return await res.json();
    } catch {}
    return { ...fallbackLearners[0], accessibility };
  },

  async getLessons(): Promise<Lesson[]> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/lessons`);
      if (res.ok) return await res.json();
    } catch {}
    return [fallbackLesson];
  },

  async getLesson(id: string): Promise<Lesson> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/lessons/${id}`);
      if (res.ok) return await res.json();
    } catch {}
    return fallbackLesson;
  },

  async startSession(learnerProfileId: number, lessonId: string): Promise<LearningSession> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/sessions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ learnerProfileId, lessonId }),
      });
      if (res.ok) return await res.json();
    } catch {}
    return createFallbackSession(fallbackLearners[0], fallbackLesson);
  },

  async getSession(sessionId: string): Promise<LearningSession> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/sessions/${sessionId}`);
      if (res.ok) return await res.json();
    } catch {}
    return createFallbackSession(fallbackLearners[0], fallbackLesson);
  },

  async adaptSession(sessionId: string, updates: {
    timeAvailable?: "2m" | "5m" | "10m";
    preference?: "VISUAL" | "READING" | "PRACTICE";
    focusLevel?: "LOW" | "MEDIUM" | "HIGH";
    accessibility?: Accessibility;
  }): Promise<LearningSession> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/sessions/${sessionId}/adapt`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updates),
      });
      if (res.ok) return await res.json();
    } catch {}
    const session = createFallbackSession(fallbackLearners[0], fallbackLesson);
    if (updates.preference) session.activeLayout = updates.preference;
    if (updates.timeAvailable) session.activeTimePreference = updates.timeAvailable;
    if (updates.focusLevel) session.activeFocusLevel = updates.focusLevel;
    if (updates.accessibility) session.activeAccessibility = updates.accessibility;
    return session;
  },

  async recordConfidence(sessionId: string, confidence: number, conceptId?: string): Promise<LearningSession> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/sessions/${sessionId}/confidence`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ confidence, conceptId }),
      });
      if (res.ok) return await res.json();
    } catch {}
    const session = createFallbackSession(fallbackLearners[0], fallbackLesson);
    session.confidenceRating = confidence;
    if (confidence <= 2) session.activeExplanationStrategy = "ANALOGY";
    else if (confidence >= 4) session.activeExplanationStrategy = "STEP_BY_STEP";
    return session;
  },

  async switchExplanationStrategy(sessionId: string, conceptId?: string): Promise<LearningSession> {
    try {
      const url = conceptId 
        ? `${API_BASE}/sessions/${sessionId}/explain-differently?conceptId=${conceptId}`
        : `${API_BASE}/sessions/${sessionId}/explain-differently`;
      const res = await fetchWithTimeout(url, { method: "POST" });
      if (res.ok) return await res.json();
    } catch {}
    const session = createFallbackSession(fallbackLearners[0], fallbackLesson);
    const curr = session.activeExplanationStrategy;
    session.activeExplanationStrategy = curr === "TECHNICAL" ? "ANALOGY" : curr === "ANALOGY" ? "STEP_BY_STEP" : "TECHNICAL";
    return session;
  },

  async advanceConcept(sessionId: string): Promise<LearningSession> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/sessions/${sessionId}/advance`, { method: "POST" });
      if (res.ok) return await res.json();
    } catch {}
    const session = createFallbackSession(fallbackLearners[0], fallbackLesson);
    session.currentConceptIndex += 1;
    return session;
  },

  async completeSession(sessionId: string): Promise<LearningSession> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/sessions/${sessionId}/complete`, { method: "POST" });
      if (res.ok) return await res.json();
    } catch {}
    const session = createFallbackSession(fallbackLearners[0], fallbackLesson);
    session.completed = true;
    return session;
  },

  async getSessionDecisions(sessionId: string): Promise<AdaptationDecision[]> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/sessions/${sessionId}/decisions`);
      if (res.ok) return await res.json();
    } catch {}
    return fallbackDecisions;
  },

  async getDashboardHistory(learnerId: number): Promise<LearningSession[]> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/dashboard/${learnerId}`);
      if (res.ok) return await res.json();
    } catch {}
    return [createFallbackSession(fallbackLearners[0], fallbackLesson)];
  },

  async runImpactSimulation(params: {
    cohortSize?: number;
    accessibilityAdoption?: number;
    adaptiveAdoption?: number;
    averageSessionMinutes?: number;
  }): Promise<ImpactSimulation> {
    try {
      const res = await fetchWithTimeout(`${API_BASE}/impact/simulation`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(params),
      });
      if (res.ok) return await res.json();
    } catch {}
    const access = params.accessibilityAdoption ?? 50;
    const adapt = params.adaptiveAdoption ?? 50;
    return {
      cohortSize: params.cohortSize ?? 500,
      fixedCompletionRate: 42.0,
      adaptiveCompletionRate: Math.round((42 + (adapt * 0.43) + (access * 0.12)) * 10) / 10,
      accessibilityEngagement: Math.round(access * 0.82 * 10) / 10,
      repeatSessionRate: Math.round((18 + (adapt * 0.45)) * 10) / 10,
      estimatedTotalLearningMinutes: Math.round((params.cohortSize ?? 500) * 5 * 0.8 * 3.4),
      simulationNotice: "Prototype Simulation — illustrative data, not measured real-world impact.",
    };
  },
};

export const fallbackLearners: LearnerProfile[] = [
  {
    id: 1,
    username: "maya",
    displayName: "Maya Chen",
    timeAvailable: "5m",
    preference: "VISUAL",
    focusLevel: "LOW",
    confidence: 2.8,
    accessibility: {
      dyslexiaFriendly: true,
      highContrast: false,
      largeText: true,
      increasedSpacing: true,
      reducedMotion: true,
      focusMode: false,
    },
  },
  {
    id: 2,
    username: "arjun",
    displayName: "Arjun Patel",
    timeAvailable: "10m",
    preference: "READING",
    focusLevel: "HIGH",
    confidence: 4.5,
    accessibility: {
      dyslexiaFriendly: false,
      highContrast: false,
      largeText: false,
      increasedSpacing: false,
      reducedMotion: false,
      focusMode: false,
    },
  },
  {
    id: 3,
    username: "sara",
    displayName: "Sara Kim",
    timeAvailable: "2m",
    preference: "PRACTICE",
    focusLevel: "MEDIUM",
    confidence: 3.2,
    accessibility: {
      dyslexiaFriendly: false,
      highContrast: true,
      largeText: false,
      increasedSpacing: false,
      reducedMotion: false,
      focusMode: false,
    },
  },
];

export const fallbackLesson: Lesson = {
  id: "lesson_sound_waves",
  title: "The Physics of Sound Waves",
  subject: "Physics & Acoustics",
  description: "Understand mechanical wave propagation, frequency, amplitude, and acoustics across states of matter.",
  estimatedMinutes: 5,
  difficulty: "Intermediate",
  concepts: [
    {
      id: "c_sound_medium",
      orderIndex: 1,
      title: "Mechanical Propagation & Mediums",
      technicalExplanation: "Sound is a mechanical longitudinal wave requiring physical particulate matter (gas, liquid, or solid) to transfer energy via cyclical compression and rarefaction cycles.",
      analogyExplanation: "Think of sound like a line of dominoes falling into each other. If there are no dominoes (a vacuum like outer space), the knock cannot travel to your ear.",
      stepByStepExplanation: "1. A source vibrates.\n2. Molecules collide with neighbors.\n3. Waves of compression travel outward.\n4. Energy reaches the ear drum.",
      shortSummary: "Sound is a vibration traveling through matter as energy waves.",
      visualDiagramLabel: "Vibrating Source (Bell) ──> Molecular Compression Grid ──> Tympanic Membrane",
      question: "Why can sound NOT travel through the vacuum of outer space?",
      options: [
        "Gravitational pull is too weak in space",
        "There is no particulate matter/medium to vibrate and transfer acoustic energy",
        "Space temperature is near absolute zero",
        "Photons absorb mechanical sound frequencies",
      ],
      correctOptionIndex: 1,
      hint: "Recall that mechanical waves require physical particles to bump into each other.",
      explanation: "Mechanical waves rely on consecutive particle collisions. Without matter in a vacuum, acoustic pressure fluctuations cannot occur.",
    },
    {
      id: "c_freq_pitch",
      orderIndex: 2,
      title: "Frequency, Oscillations & Pitch",
      technicalExplanation: "Wave frequency represents cycles per second measured in Hertz (Hz). Higher oscillation frequencies correspond directly to higher perceptual pitch, spanning the human auditory range of 20 Hz to 20,000 Hz.",
      analogyExplanation: "Imagine rapid clapping versus slow clapping. High frequency is clapping 10 times a second (a high whistle), while low frequency is a slow steady thump (a deep bass drum).",
      stepByStepExplanation: "1. Measure oscillations per second (Hertz).\n2. Dense cycles = High pitch.\n3. Spread cycles = Low pitch.\n4. Auditory cochlea maps frequency to pitch sensation.",
      shortSummary: "Frequency determines whether sound is high-pitched (fast waves) or deep bass (slow waves).",
      visualDiagramLabel: "Tightly Packed Wave Peaks (High Hz = Treble) vs Broad Spaced Peaks (Low Hz = Bass)",
      question: "Which physical attribute of a sound wave directly governs perceptual pitch?",
      options: [
        "Amplitude peak height",
        "Propagation speed through steel",
        "Cyclical frequency (Hertz)",
        "Wave reflection angle",
      ],
      correctOptionIndex: 2,
      hint: "Think about how many wave cycles pass a fixed point each second.",
      explanation: "Frequency represents the oscillation rate in Hertz (Hz), which human auditory systems translate as pitch.",
    },
    {
      id: "c_amp_volume",
      orderIndex: 3,
      title: "Amplitude, Energy & Decibels",
      technicalExplanation: "Amplitude measures the displacement magnitude of oscillating particles from equilibrium. Greater displacement carries exponential acoustic energy, perceived as volume or loudness measured logarithmically in Decibels (dB).",
      analogyExplanation: "Think of ocean waves: gentle ripples hardly move a boat (low amplitude / whisper), but towering tidal waves carry enormous power (high amplitude / rock concert).",
      stepByStepExplanation: "1. Vibration force determines displacement from rest.\n2. Higher displacement = taller wave peak.\n3. Sound energy scales with amplitude squared.\n4. Ear interprets energy as decibels (dB).",
      shortSummary: "Taller wave peaks mean higher energy and louder volume.",
      visualDiagramLabel: "Wave Height (Peak to Trough) = Energy Magnitude (dB Loudness)",
      question: "If you double the amplitude of a sound wave, how is the perceived sound altered?",
      options: [
        "Pitch shifts up one octave",
        "The sound becomes significantly louder due to increased acoustic energy",
        "Propagation speed doubles",
        "The wave transforms into an electromagnetic wave",
      ],
      correctOptionIndex: 1,
      hint: "Amplitude correlates with the volume and energy of the wave, not its pitch.",
      explanation: "Amplitude measures wave crest height and displacement, which translates directly to loudness and energy in decibels (dB).",
    },
  ],
};

export const fallbackDecisions: AdaptationDecision[] = [
  {
    adaptationType: "LESSON_LENGTH",
    previousValue: "3 concepts",
    newValue: "1 concept",
    reason: "Paced session for 5 minutes with low focus constraints.",
    timestamp: new Date().toISOString(),
  },
  {
    adaptationType: "PRESENTATION_LAYOUT",
    previousValue: "Standard Reading",
    newValue: "Visual Card & Relationship Map",
    reason: "Transformed technical descriptions into visual diagrams and concept cards.",
    timestamp: new Date().toISOString(),
  },
  {
    adaptationType: "DYSLEXIA_TYPOGRAPHY",
    previousValue: "Standard Sans",
    newValue: "High-Legibility Spaced Typeface",
    reason: "Applied dyslexia-friendly letter spacing, line height (1.8x), and distinct character geometry.",
    timestamp: new Date().toISOString(),
  },
  {
    adaptationType: "MOTION_DYNAMICS",
    previousValue: "Fluid Spring Transitions",
    newValue: "Instant / Zero-Motion",
    reason: "Disabled non-essential transitions to respect vestibular comfort and reduced motion.",
    timestamp: new Date().toISOString(),
  },
];

function createFallbackSession(profile: LearnerProfile, lesson: Lesson): LearningSession {
  return {
    id: "sess_fallback_1",
    learnerProfileId: profile.id || 1,
    lessonId: lesson.id,
    lessonTitle: lesson.title,
    startTime: new Date().toISOString(),
    completed: false,
    currentConceptIndex: 0,
    activeLayout: profile.preference,
    activeExplanationStrategy: profile.confidence < 3 ? "ANALOGY" : "TECHNICAL",
    activeTimePreference: profile.timeAvailable,
    activeFocusLevel: profile.focusLevel,
    activeAccessibility: profile.accessibility,
    confidenceRating: profile.confidence,
    totalAdaptations: 4,
    adaptationPlan: {
      layout: profile.preference,
      conceptCount: profile.focusLevel === "LOW" ? 1 : profile.timeAvailable === "2m" ? 1 : 2,
      estimatedMinutes: profile.timeAvailable === "2m" ? 2 : profile.timeAvailable === "5m" ? 5 : 10,
      fontScale: profile.accessibility.largeText ? 1.25 : 1.0,
      spacing: profile.accessibility.increasedSpacing || profile.accessibility.dyslexiaFriendly ? "RELAXED" : "STANDARD",
      interactionStyle: profile.preference === "PRACTICE" ? "INTERACTIVE_CHECK" : profile.preference === "VISUAL" ? "REVEAL" : "DIRECT",
      motion: profile.accessibility.reducedMotion ? "REDUCED" : "FULL",
      contrastMode: profile.accessibility.highContrast ? "HIGH_CONTRAST" : "STANDARD",
      explanationStrategy: profile.confidence < 3 ? "ANALOGY" : "TECHNICAL",
      dyslexiaFriendly: profile.accessibility.dyslexiaFriendly,
      focusMode: profile.accessibility.focusMode,
      decisions: fallbackDecisions,
      humanReadableExplanations: fallbackDecisions.map((d) => d.reason),
    },
    concepts: lesson.concepts || [],
  };
}
