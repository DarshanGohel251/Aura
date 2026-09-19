# Aura — Adaptive Micro-Learning Platform
> *"Learning should adapt to the learner."*

**Acodemic x G.I.R.L.S. Global SDG Hackathon Entry**  
**Core UN SDG Focus:** [SDG 4 — Quality Education (Targets 4.5 & 4.6)](https://sdgs.un.org/goals/goal4)

---

## 💡 The Core Thesis

Traditional digital education enforces a rigid, one-size-fits-all lesson presentation. When learners encounter constraints—whether a 5-minute time window, low cognitive energy, or dyslexia—they are blamed for dropping out.

**Aura flips this paradigm:**  
> **Same learning objective → different learner conditions → genuinely different learning experience.**

Aura evaluates your **time window, focus state, confidence signals, and universal accessibility needs** to dynamically synthesize lessons into visual schematics, deep reading columns, or active-retrieval challenges with custom typography, spacing, and pacing.

---

## 🏛️ Technical Architecture

Aura is built as a **modular full-stack system**:

```text
       Next.js 16 (App Router + React 19 + Framer Motion + Tailwind CSS)
                                  │
                          REST / Health APIs
                                  ▼
         Spring Boot 4.1 Modular Monolith (Java 21 LTS)
                                  │
    ┌─────────────────────────────┼─────────────────────────────┐
    ▼                             ▼                             ▼
JPA / Hibernate           Adaptive Learning             Real-Time Telemetry
(PostgreSQL / H2)              Engine                     & Event Logging
                                  │
                    Multi-Signal Constraint Engine
                    (Time + Focus + Neurodivergence)
```

### Core Backend Components
- **`AdaptiveLearningEngine`**: Deterministic domain service evaluating constraints and generating an `AdaptationPlan` with an audit trail of `AdaptationDecision` records.
- **Confidence Feedback Loop**: Real-time evaluation of learner confidence (1–5) automatically triggers strategy pivots (e.g. Technical ➔ Real-World Analogy ➔ Step-by-Step).
- **Persistent Domain Entities**: `LearnerProfile`, `AccessibilityPreference`, `Lesson`, `Concept`, `LearningSession`, `ConceptProgress`, `InteractionEvent`, `AdaptationDecision`, `ImpactScenario`.
- **Explainable Adaptation**: Every single change (e.g. typography scaling, concept reduction, layout restructuring) is logged with a human-readable reason.

---

## 🚀 Quickstart & Demo Setup

### Option 1: Zero-Config Local Run (Recommended for Judges)

#### 1. Start the Spring Boot Backend (uses in-memory H2 with seed data):
```bash
cd backend
./mvnw spring-boot:run     # On Windows: .\mvnw.cmd spring-boot:run
```
*Backend will start on `http://localhost:8080` with pre-seeded personas (`maya`, `arjun`, `sara`) and lessons.*  
*H2 Web Console available at `http://localhost:8080/h2-console` (JDBC URL: `jdbc:h2:mem:auradb`).*

#### 2. Start the Next.js Frontend:
```bash
npm install
npm run dev
```
*Open [http://localhost:3000](http://localhost:3000) in your browser.*

---

### Option 2: Docker Compose (Full-Stack with PostgreSQL)
```bash
docker compose up --build
```
- Frontend: `http://localhost:3000`
- Backend: `http://localhost:8080`
- PostgreSQL: `localhost:5432` (db: `auradb`, user: `aura`, password: `aura_secret`)

---

## ⏱️ The 60-Second Judge Walkthrough Flow

To experience the entire thesis in 60 seconds:

1. **Launch the Demo Runner**: Navigate to [`/demo`](http://localhost:3000/demo) or click **"Run Demo"** in the top-right **Judge Mode** pill.
2. **Observe Baseline (0:00–0:15)**: Notice the default 10-minute dense reading format designed for Arjun (high focus).
3. **Trigger Constraints (0:15–0:30)**: Watch the system adapt to Maya (5 min, Low Focus, Dyslexia-Friendly).
4. **Witness Transformation (0:30–0:45)**:
   - Concepts chunked from 3 down to 1.
   - Text converted to an interactive **Visual Relationship Map**.
   - Typography adjusted to high-legibility geometry with 1.8x line height and relaxed spacing.
5. **Inspect "See What Changed" (0:45–0:55)**: View the exact backend decision audit trail explaining *why* each parameter shifted.
6. **Confidence Loop (0:55–1:10)**: Rate confidence as 2/5 and watch Aura pivot from technical jargon to an intuitive real-world analogy.
7. **Review Learning Pulse & SDG Impact**: Explore [`/dashboard`](http://localhost:3000/dashboard) and [`/impact`](http://localhost:3000/impact) for interactive cohort simulations.

---

## ♿ Accessibility First

- **Dyslexia-Friendly Mode**: High-legibility sans-serif with increased character spacing, 1.8x line height, and shorter column widths. No childish fonts.
- **High-Contrast Mode**: Exceeds WCAG AAA contrast ratio (>7:1) with sharp visual delineations.
- **Reduced Motion**: Directly respects `prefers-reduced-motion` and disables all kinetic spring animations.
- **Zen Focus Mode**: Dims distractions and ambient effects to prevent attention derailment.

---

## 🧪 Verification & Tests

To execute the backend test suite covering the 5 multi-signal adaptation scenarios:
```bash
cd backend
./mvnw test     # On Windows: .\mvnw.cmd test
```
All tests verify deterministic behavior across high focus, low focus, neurodivergent accessibility, and confidence pivots.
