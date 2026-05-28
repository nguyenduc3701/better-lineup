# 📁 Project Structure & Code Separation Guidelines (Next.js & Spring Boot)

This document outlines the standard folder structure, coding rules, and file separation principles for the **Better Lineup** project. AI coding assistants should strictly adhere to this guide when generating, refactoring, or creating files in the codebase.

---

## 📌 Core Design Principles

1. **Single Responsibility Principle (SRP):** Each file must do exactly one thing. Do not mix UI rendering, state management, and API calls in a single component.
2. **Clean Layered Architecture (Backend):** Clear separation between Controllers (HTTP), Services (Business Logic), Repositories (Data Access), and Entities (Database Schema).
3. **Modular Component Design (Frontend):** Separate reusable UI components from container components (page logic). Use custom hooks to isolate UI state and side effects.
4. **Explicit Contract (API DTOs):** Use Data Transfer Objects (DTOs) for API request/response. Never expose JPA Database Entities directly to the API client.

---

## 💻 Frontend (Next.js - App Router)

The frontend is built using **Next.js (App Router), TypeScript, and TailwindCSS**.

### 📂 Directory Tree

```text
frontend/
├── public/                 # Static assets (images, SVGs, custom fonts, icons)
├── src/
│   ├── app/                # Next.js App Router (routing, layout, pages)
│   │   ├── layout.tsx      # Global app layout (Providers, Root HTML)
│   │   ├── page.tsx        # Homepage (Landing Page / Lineup builder)
│   │   ├── lineup/         # Sub-routes (/lineup)
│   │   │   └── page.tsx    # Lineup Management Page
│   │   └── api/            # Next.js Route Handlers (BFF / proxy if needed)
│   ├── components/         # Reusable React components
│   │   ├── ui/             # Core UI primitives (Button, Input, Dialog, etc.)
│   │   ├── common/         # Layout elements (Header, Sidebar, Footer)
│   │   └── lineup/         # Feature-specific components (LineupBoard, PlayerCard)
│   ├── hooks/              # Custom React Hooks (UI State, Actions, DnD logic)
│   │   └── useLineupDrag.ts
│   ├── services/           # API Connection Layer (Axios / Fetch)
│   │   ├── api-client.ts   # Base axios setup with interceptors & environment config
│   │   ├── player.service.ts # Methods to call Player API endpoints
│   │   └── lineup.service.ts # Methods to call Lineup API endpoints
│   ├── store/              # Global State Management (Zustand)
│   │   └── lineupStore.ts  # Zustand store for lineups & dragged elements
│   ├── locales/            # Localization JSON dictionaries
│   │   ├── en.json         # English translations
│   │   └── vi.json         # Vietnamese translations
│   ├── types/              # TS Type definitions & Interfaces
│   │   ├── index.ts
│   │   ├── player.ts
│   │   └── lineup.ts
│   ├── utils/              # Pure utility functions (formatting, math, classnames)
│   │   └── cn.ts           # Tailwind Merge utility
│   └── constants/          # Static app constants (Route paths, Config limits)
│       └── config.ts
```

### ⚙️ Frontend Separation Rules

#### 1. React Components vs. Custom Hooks
Components should focus on **rendering HTML and CSS**. Logic, event handling, or state coordination should be moved to a custom hook or Zustand store.
* **Component File (`lineup-board.tsx`):**
  ```tsx
  import { useLineupDrag } from '@/hooks/useLineupDrag';
  import PlayerCard from './player-card';

  export default function LineupBoard() {
    const { players, handleDragEnd } = useLineupDrag();
    return (
      <div className="grid grid-cols-11 gap-4 bg-emerald-800 p-6 rounded-xl shadow-2xl">
        {players.map(p => (
          <PlayerCard key={p.id} player={p} onDragEnd={handleDragEnd} />
        ))}
      </div>
    );
  }
  ```

#### 2. Services vs. Page Fetching
Never write inline `fetch` or `axios` queries in your components. Always import from a service wrapper.
* **Service File (`src/services/player.service.ts`):**
  ```typescript
  import apiClient from './api-client';
  import { Player } from '@/types/player';

  export const PlayerService = {
    getAll: async (): Promise<Player[]> => {
      const response = await apiClient.get<Player[]>('/api/v1/players');
      return response.data;
    },
    create: async (playerData: Omit<Player, 'id'>): Promise<Player> => {
      const response = await apiClient.post<Player>('/api/v1/players', playerData);
      return response.data;
    }
  };
  ```

#### 3. Styling Guidelines
* Use **TailwindCSS** classes.
* Avoid custom inline style objects unless calculating dynamic positions (like drag-and-drop coordinates).
* Utilize the `cn()` utility (`clsx` + `tailwind-merge`) for conditional styling.

#### 4. Internationalization (i18n) & Locales
* **Do not hardcode translation keys or objects** inside component files or huge `translations.ts` files.
* Store translations in separate JSON files per locale under `src/locales/` (e.g. `en.json`, `vi.json`).
* Expose translations through a typed config (like `src/app/translations.ts`) using static imports so that compiler checks remain active.
  ```typescript
  import en from "../locales/en.json";
  import vi from "../locales/vi.json";
  
  export type SupportedLang = "en" | "vi";
  export type Translations = typeof en;
  
  export const translations: Record<SupportedLang, Translations> = {
    en,
    vi: vi as Translations,
  };
  ```

---

## ☕ Backend (Spring Boot)

The backend is built with **Spring Boot (Java 21, Maven, MySQL)**.

### 📂 Directory Tree

```text
backend/
├── src/
│   ├── main/
│   │   ├── java/com/betterlineup/
│   │   │   ├── config/             # Spring Configurations (Security, Cors, OpenAPI)
│   │   │   │   └── CorsConfig.java
│   │   │   ├── controller/         # REST API Controllers (Endpoint declarations)
│   │   │   │   ├── PlayerController.java
│   │   │   │   └── LineupController.java
│   │   │   ├── service/            # Service Layer (Business Logic interfaces)
│   │   │   │   ├── PlayerService.java
│   │   │   │   └── impl/           # Service implementations
│   │   │   │       ├── PlayerServiceImpl.java
│   │   │   │       └── LineupServiceImpl.java
│   │   │   ├── repository/         # Data Access Objects (JPA / Spring Data)
│   │   │   │   ├── PlayerRepository.java
│   │   │   │   └── LineupRepository.java
│   │   │   ├── model/              # JPA Entities representing database tables
│   │   │   │   ├── Player.java
│   │   │   │   └── Lineup.java
│   │   │   ├── dto/                # Data Transfer Objects
│   │   │   │   ├── request/        # Request payload types (e.g. PlayerCreateRequest)
│   │   │   │   └── response/       # Response payload types (e.g. PlayerResponse)
│   │   │   ├── mapper/             # MapStruct or Manual model-to-dto converters
│   │   │   │   └── PlayerMapper.java
│   │   │   └── exception/          # Custom Exception files and Exception Handlers
│   │   │       ├── ResourceNotFoundException.java
│   │   │       └── GlobalExceptionHandler.java
│   │   └── resources/
│   │       ├── application.yml     # Application properties (MySQL credentials, Server port)
│   │       └── db/migration/       # Database setup/migration scripts (SQL files)
│   └── test/                       # Unit & Integration tests for Controllers & Services
```

### ⚙️ Backend Separation Rules

#### 1. Controller Layer (`@RestController`)
* Responsibilities: Request validation, path mapping, mapping status codes, delegating to Service Layer.
* **NO business logic** (e.g., calculations, validation rules, DB queries) in controllers.
* Example:
  ```java
  @RestController
  @RequestMapping("/api/v1/players")
  @RequiredArgsConstructor
  public class PlayerController {
      private final PlayerService playerService;

      @PostMapping
      public ResponseEntity<PlayerResponse> createPlayer(@Valid @RequestBody PlayerCreateRequest request) {
          PlayerResponse response = playerService.createPlayer(request);
          return new ResponseEntity<>(response, HttpStatus.CREATED);
      }
  }
  ```

#### 2. Service Layer (`@Service`)
* Responsibilities: Data transaction handling, mapping Entities to DTOs, calculations, custom validation rules.
* **Always implement interfaces** (e.g., `PlayerServiceImpl` implements `PlayerService`) to support dependency injection decoupling.
* Example:
  ```java
  @Service
  @Transactional
  @RequiredArgsConstructor
  public class PlayerServiceImpl implements PlayerService {
      private final PlayerRepository playerRepository;
      private final PlayerMapper playerMapper;

      @Override
      public PlayerResponse createPlayer(PlayerCreateRequest request) {
          Player player = playerMapper.toEntity(request);
          Player savedPlayer = playerRepository.save(player);
          return playerMapper.toResponse(savedPlayer);
      }
  }
  ```

#### 3. Repository Layer (`@Repository`)
* Responsibilities: Direct database operations.
* Avoid writing complex custom SQL directly unless necessary; leverage Spring Data JPA query creation methods (`findBy...`).

#### 4. DTO Pattern
* Entities (`@Entity`) should **never** be returned directly to the UI layer. This prevents leaks of internal schema structures (e.g., password hashes, audit fields) and avoids lazy loading exceptions (`LazyInitializationException`).
* Keep `request` DTOs and `response` DTOs separate.

---

## 🔗 Contract & Communication (FE & BE API Best Practices)

1. **REST Protocol Standards:**
   * `GET` -> Fetch data (no side-effects)
   * `POST` -> Create resource
   * `PUT` -> Complete update of resource
   * `PATCH` -> Partial update of resource
   * `DELETE` -> Remove resource
2. **Response Wrappers:** Standardize API responses so the frontend can intercept errors gracefully.
   ```json
   {
     "status": 200,
     "message": "Success",
     "data": { ... }
   }
   ```
   Or in case of validation error (400 Bad Request):
   ```json
   {
     "status": 400,
     "message": "Validation failed",
     "errors": {
       "name": "Name is required",
       "position": "Invalid position value"
     }
   }
   ```
3. **URL Paths:** Use plural resource naming. Example: `/api/v1/players` instead of `/api/v1/getPlayer` or `/api/v1/player`.
