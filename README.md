<p align="center">
  <img src="../Ludex/src/assets/LogoLudex3Ridimensionato.png" alt="Ludex Logo" width="300"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue" />
  <img src="https://img.shields.io/badge/Redux-State%20Managed-purple" />
  <img src="https://img.shields.io/badge/Architecture-Behavior%20Driven-black" />
</p>

---

# 🇬🇧 LUDEX — Frontend Architecture Documentation

## Executive Summary

Ludex is a **behavior-driven game discovery platform** built around progressive personalization.

The frontend is architected as a **state-orchestrated interaction layer** designed to:

- Capture behavioral signals
- Maintain deterministic UI state
- Propagate state transitions predictably
- Synchronize with backend scoring logic
- Deliver real-time feedback without compromising consistency

**Backend Repository:**  
🔗 https://github.com/Luigi9665/BackEndCapstone

---

# 1. Architectural Principles

## 1.1 Deterministic State

All state transitions are reducer-driven.

There are **no hidden side effects**.

State + Action → New State

The system guarantees reproducibility and traceability.

---

## 1.2 Behavioral Signal Aggregation

Every meaningful interaction generates a signal:

- Viewing a game page
- Adding to backlog
- Updating status
- Completing a game
- Rating
- Reviewing
- Marking “Not Interested”
- Questionnaire preferences

The frontend ensures these signals are:

- Persisted
- Reflected locally
- Maintained across navigation flows

---

## 1.3 Domain Isolation

Redux state is segmented by domain:

- `auth`
- `userData`
- `recommendations`
- `homePublic`
- `gameDetails`
- `ui`

Each domain:

- Owns its reducer
- Owns its async lifecycle
- Avoids cross-domain mutation
- Maintains referential integrity

---

# 2. State Modeling Strategy

## 2.1 Game Lifecycle Model

A game can exist in one of the following contexts:

### A. Recommendation Context (Transient)

- Visible
- Pending interaction
- Excluded (15-day TTL)
- Converted to UserGame

### B. Library Context (Persistent)

- `userGameId`
- `status`
- `progress`
- `rating`
- `review`
- `visibility`
- `lastUpdatedAt`

### C. Exclusion Context (15-Day Rule)

When the user selects **"Not Interested"**:

- Backend stores exclusion timestamp
- Game becomes invisible in recommendation feed
- Automatically re-evaluated after 15 days
- Re-injected into scoring model

This ensures:

- User intent is respected
- Recommendation pool remains dynamic
- Hard blacklisting is avoided

---

## 2.2 Interested Flow

**User Click → API POST → Backend CreateUserGame  
→ Redux Success  
→ Merge into `userData.my.games`  
→ Remove from `recommendation.items`  
→ Toast Feedback**

Key properties:

- No global refetch required
- Controlled local removal
- Success-based mutation only
- `pendingByGameId` prevents multi-click

---

## 2.3 Not Interested Flow

**User Click → API POST (Exclusion)  
→ Redux Success  
→ Remove locally  
→ Backend enforces TTL lifecycle**

The frontend does **not permanently delete** the entity.  
It respects backend-controlled expiration.

---

# 3. Data Consistency Strategy

The frontend guarantees:

- Immutable reducer returns
- No nested mutation
- Patch-based updates
- Avoidance of unnecessary profile reloads
- Referential stability where possible

Example patch strategy:

```js
userData.my.games.map(g =>
  g.userGameId === updated.userGameId ? updated : g
)
This avoids cascade re-renders.

4. Recommendation Feedback Loop
The frontend participates in a scoring feedback cycle.

Signals Sent to Backend
Interaction	Impact
View game	Implicit interest
Add to backlog	Positive weight
Complete	Strong positive weight
High rating	Genre reinforcement
Drop game	Negative signal
Not Interested	Temporary exclusion
Questionnaire	Explicit preference
Frontend responsibilities:

Avoid caching stale recommendation sets blindly

Allow refresh when behavioral model changes

Maintain UX consistency during transitions

5. Performance Strategy
5.1 Render Optimization
React.memo for heavy sidebars

Domain-specific useSelector calls

Avoid selecting entire slices

Stable reducer shapes

Avoid object recreation when data unchanged

5.2 Async Optimization
Controlled dispatch

No redundant fetch if data already present

Optional TTL-based caching

Parallel fetch where safe

5.3 UX Optimization
Toast feedback system

Non-blocking transitions

Optimistic UI updates

Carousel virtualization logic

6. Scalability Considerations
The frontend architecture supports:

Increased recommendation volume

Additional behavioral signals

Multi-layer scoring logic

Feature flag integration

Real-time updates (WebSocket-ready design)

Domain separation ensures:

New features can be added without refactoring core reducers.

7. Architectural Decision Records (ADR)
ADR-01: Redux for cross-domain consistency

ADR-02: Remove recommendation only after success

ADR-03: TTL-based exclusion instead of permanent delete

ADR-04: Optimistic merge instead of full refetch

ADR-05: Domain-based selectors to prevent unnecessary re-renders

8. Interaction Flow Diagram
flowchart TD

A[User Action] --> B{Interaction Type}

B -->|View Game| C[Track View Signal]
B -->|Interested| D[Create UserGame]
B -->|Not Interested| E[Store Exclusion TTL]
B -->|Update Status| F[Patch UserGame]
B -->|Rate / Review| F
B -->|Delete| G[Remove UserGame]

D --> H[Redux Merge userData]
F --> H
G --> H
E --> I[Remove from Recommendations]

H --> J[Backend Recalculate Score]
I --> J

J --> K[New Recommendation Set]
K --> L[Frontend Refresh Trigger]
9. Professional Positioning
Ludex frontend is not just a UI layer.

It is:

A behavioral state orchestrator

A deterministic interaction engine

A consistency-preserving bridge to recommendation logic

A scalable architecture designed for evolving personalization models

🇮🇹 LUDEX — Documentazione Architetturale Frontend
Executive Summary
Ludex è una piattaforma di scoperta videogiochi basata su modellazione comportamentale progressiva.

Il frontend è:

Un orchestratore di stato

Un motore di segnali comportamentali

Un layer deterministico tra utente e algoritmo

Repository Backend:
🔗 https://github.com/Luigi9665/BackEndCapstone

Ciclo di Vita del Gioco
Un gioco può essere:

Raccomandazione attiva

Convertito in UserGame

Escluso temporaneamente (15 giorni)

Parte della libreria

Eliminato

Ogni transizione è tracciata e riflessa immediatamente nello stato globale.

Gestione Esclusione 15 Giorni
Persistenza lato backend

Rimozione immediata lato frontend

Nessuna blacklist permanente

Rientro nel ciclo dopo TTL

Questo garantisce:

Rispetto dell’intento utente

Evoluzione continua delle raccomandazioni

Assenza di stagnazione algoritmica

Performance
React.memo su componenti ad alto costo

Selettori granulari

Merge immutabile

Nessun refetch non necessario

Ottimizzazione animazioni

Conclusione
Ludex frontend è progettato per:

Essere scalabile

Essere deterministico

Essere performante

Supportare modelli di raccomandazione evolutivi

Non è una semplice SPA.

È un sistema di stato orientato al comportamento utente.


---
```
