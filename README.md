<p align="center">
  <img src="/public/Me.png" alt="Me" width="150"/>
  <img src="/public/LogoLudex3Ridimensionato.png" alt="Ludex Logo" width="300"/>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/React-18-blue" />
  <img src="https://img.shields.io/badge/Redux-State%20Managed-purple" />
  <img src="https://img.shields.io/badge/Architecture-Behavior%20Driven-black" />
</p>

---

# LUDEX — Frontend Architecture

---

**Backend Repository**  
https://github.com/Luigi9665/BackEndCapstone

## Executive Summary

Ludex is a behavior-driven game discovery platform built around progressive personalization.

The frontend is not merely a UI layer.  
It is a deterministic state orchestration engine designed to:

- Capture behavioral signals
- Maintain consistent UI state
- Propagate predictable state transitions
- Synchronize with backend scoring logic
- Deliver responsive feedback without breaking referential integrity

---

## 1. Architectural Principles

### 1.1 Deterministic State

All state transitions are reducer-driven.

Given:

State + Action → New State

The system guarantees:

- Reproducibility
- Traceability
- Predictable UI rendering
- No hidden side effects

---

### 1.2 Behavioral Signal Aggregation

Every meaningful interaction generates a scoring signal:

- Viewing a game page
- Adding to backlog
- Updating status
- Completing a game
- Rating
- Reviewing
- Marking “Not Interested”
- Submitting questionnaire preferences

The frontend ensures these signals are:

- Persisted
- Reflected locally
- Maintained across navigation flows
- Synchronized with backend recalculation

---

### 1.3 Domain Isolation

Redux state is segmented into domains:

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
- Maintains referential stability

---

## 2. State Modeling Strategy

### 2.1 Game Lifecycle Model

A game can exist in multiple contexts.

#### A. Recommendation Context (Transient)

- Visible
- Pending interaction
- Temporarily excluded (15-day TTL)
- Convertible to UserGame

#### B. Library Context (Persistent)

- `userGameId`
- `status`
- `progress`
- `rating`
- `review`
- `visibility`
- `lastUpdatedAt`

#### C. Exclusion Context (15-Day Rule)

When the user selects "Not Interested":

- Backend stores exclusion timestamp
- Game disappears from recommendation feed
- Automatically re-evaluated after 15 days
- Re-injected into scoring model

This ensures:

- User intent is respected
- The recommendation pool remains dynamic
- Hard blacklisting is avoided

---

## 2.2 Interested Flow

User Click  
→ API POST  
→ Backend creates UserGame  
→ Redux success action  
→ Merge into `userData.my.games`  
→ Remove from `recommendations.items`  
→ Toast feedback

Key properties:

- No global refetch required
- Controlled local removal
- Mutation only after success
- `pendingByGameId` prevents multi-click

---

## 2.3 Not Interested Flow

User Click  
→ API POST exclusion  
→ Redux success  
→ Remove locally  
→ Backend enforces TTL lifecycle

The frontend does not permanently delete the entity.  
It respects backend-controlled expiration.

---

## 3. Data Consistency Strategy

The frontend guarantees:

- Immutable reducer returns
- No nested mutation
- Patch-based updates
- Avoidance of unnecessary full profile reloads
- Referential stability where possible

### Example Patch Strategy

### Example Patch Strategy

```javascript
userData.my.games.map(g =>
  g.userGameId === updated.userGameId ? updated : g
);
This prevents cascade re-renders and preserves component memoization.

4. Recommendation Feedback Loop
The frontend participates in a scoring feedback cycle.

Interaction	Signal Impact
View game	Implicit interest
Add to backlog	Positive weight
Complete	Strong positive
High rating	Genre reinforcement
Drop game	Negative signal
Not Interested	Temporary exclusion
Questionnaire	Explicit preference
Frontend Responsibilities
Avoid caching stale recommendation sets

Allow refresh when behavioral model changes

Maintain UX consistency during transitions

5. Performance Strategy
Render Optimization
React.memo for heavy sidebars

Domain-specific useSelector

Avoid selecting entire slices

Stable reducer shapes

Avoid unnecessary object recreation

Async Optimization
Controlled dispatch

No redundant fetch if data already present

Optional TTL-based caching

Parallel fetch when safe

UX Optimization
Toast-based feedback

Non-blocking transitions

Optimistic UI updates

Carousel virtualization

6. Engineering Tradeoffs
Tradeoff 1: Optimistic Merge vs Full Refetch
Decision: Patch locally instead of refetching profile.
Benefit: Reduced network overhead and faster UX.
Risk: Requires strict reducer discipline.

Tradeoff 2: TTL-Based Exclusion vs Permanent Delete
Decision: Temporary exclusion (15 days).
Benefit: Prevents algorithm stagnation.
Risk: Requires backend enforcement and synchronization.

Tradeoff 3: Redux Over Context
Decision: Centralized state orchestration.
Benefit: Cross-domain consistency.
Cost: Higher architectural complexity.

7. Interaction Flow Diagram
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
8. Architectural Positioning
Ludex frontend is:

A behavioral state orchestrator

A deterministic interaction engine

A consistency-preserving bridge to recommendation logic

A scalable architecture designed for evolving personalization models

It is not a simple SPA.

It is a state-driven behavioral system.

![Architecture](https://img.shields.io/badge/Architecture-State%20Orchestrated-black)
![Pattern](https://img.shields.io/badge/Pattern-Behavior%20Driven-purple)
![Scalability](https://img.shields.io/badge/Scalability-High-success)
![Rendering](https://img.shields.io/badge/Rendering-Optimized-blue)
![Consistency](https://img.shields.io/badge/Consistency-Deterministic-critical)
```
