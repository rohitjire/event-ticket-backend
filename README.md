# Event Ticket Platform

A full-stack event ticketing platform for creating events, selling tickets, and validating attendees with QR codes.

## Tech Stack

**Backend:** Java 17, Spring Boot 4, Spring Security (OAuth2/OIDC), Spring Data JPA, PostgreSQL, Flyway, MapStruct, ZXing (QR codes)

**Frontend:** React 19, TypeScript, Vite, Tailwind CSS, Shadcn UI, React Router, OIDC Client

**Auth:** Keycloak (managed via Cloud-IAM)

**Deployment:** Docker, Render (backend + PostgreSQL), Flyway migrations

## Features

- **Event Management** - Create, update, publish, and delete events with multiple ticket types
- **Ticket Purchasing** - Browse published events and purchase tickets with stock validation (pessimistic locking)
- **QR Code Generation** - Automatic QR code generation on ticket purchase
- **Ticket Validation** - Scan QR codes or manually validate tickets at entry (prevents double-entry)
- **Role-Based Access** - Organizer, Attendee, and Staff roles via Keycloak
- **User Registration** - Self-service registration through Keycloak
- **Full-Text Search** - Search events by name or venue (PostgreSQL full-text search)
- **API Documentation** - Swagger UI with OpenAPI 3.0

## Architecture

```
                    ┌──────────────┐
                    │   Keycloak   │
                    │  (Cloud-IAM) │
                    └──────┬───────┘
                           │ JWT
    ┌──────────────────────┼──────────────────────┐
    │     Spring Boot      │                      │
    │  ┌───────────┐  ┌────┴─────┐  ┌──────────┐  │
    │  │  React    │  │ Security │  │ REST API │  │
    │  │  (static) │  │  Filter  │  │ /api/v1  │  │
    │  └───────────┘  └──────────┘  └────┬─────┘  │
    │                                    │        │
    │                              ┌─────┴──────┐ │
    │                              │  Services  │ │
    │                              └─────┬──────┘ │
    │                              ┌─────┴──────┐ │
    │                              │ PostgreSQL │ │
    │                              └────────────┘ │
    └─────────────────────────────────────────────┘
```

## Project Structure

```
├── src/main/
│   ├── frontend/          # React frontend source (built separately)
│   ├── java/              # Spring Boot backend
│   └── resources/
│       ├── db/migration/  # Flyway SQL migrations
│       └── static/        # Frontend build output (auto-copied during Maven build)
├── Dockerfile
├── docker-compose.yml     # Local dev (PostgreSQL, Keycloak)
└── pom.xml
```

## API Endpoints

| Method | Endpoint | Auth | Description |
|--------|----------|------|-------------|
| GET | `/api/v1/published-events` | Public | List published events |
| GET | `/api/v1/published-events/{id}` | Public | Get event details |
| POST | `/api/v1/events` | Organizer | Create event |
| GET | `/api/v1/events` | Organizer | List organizer's events |
| PUT | `/api/v1/events/{id}` | Organizer | Update event |
| DELETE | `/api/v1/events/{id}` | Organizer | Delete event |
| POST | `/api/v1/events/{id}/ticket-types/{id}/tickets` | Authenticated | Purchase ticket |
| GET | `/api/v1/tickets` | Authenticated | List user's tickets |
| GET | `/api/v1/tickets/{id}/qr-codes` | Authenticated | Download QR code |
| POST | `/api/v1/ticket-validations` | Staff | Validate ticket |

## Running Locally

### Prerequisites
- Java 17+
- Node.js 20+
- Docker & Docker Compose

### 1. Start PostgreSQL and Keycloak
```bash
docker-compose up -d
```

### 2. Configure Keycloak
- Open http://localhost:9090 (admin/admin)
- Create realm: `event-ticket-platform`
- Create client: `event-ticket-platform-app` (public, OIDC)
- Create roles: `ROLE_ORGANIZER`, `ROLE_ATTENDEE`, `ROLE_STAFF`
- Enable user self-registration

### 3. Start Backend
```bash
./mvnw spring-boot:run
```

### 4. Start Frontend (dev mode with hot reload)
```bash
cd src/main/frontend
npm install
npm run dev
```

Open http://localhost:5173 (Vite dev server with API proxy to 8080).

### Production Build (single JAR with frontend)
```bash
./mvnw package -Pprod
java -jar target/event-ticket-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod
```

The `prod` profile auto-installs Node.js, builds the React app, and bundles it into the JAR as static resources.

## Deployment (Render)

### Steps
1. Push to GitHub
2. Create a **PostgreSQL** database on Render (free tier)
3. Create a **Web Service** on Render, connected to the repo
4. Render auto-detects the Dockerfile, which builds both frontend and backend
5. Add environment variables (see below)
6. Set health check path to `/actuator/health`

### Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `DATABASE_URL` | PostgreSQL JDBC connection URL | `jdbc:postgresql://host:5432/dbname` |
| `DATABASE_USERNAME` | Database username | `event_ticket_user` |
| `DATABASE_PASSWORD` | Database password | `*****` |
| `KEYCLOAK_ISSUER_URI` | Keycloak realm issuer URL | `https://xxx.cloud-iam.com/realms/event-ticket-platform` |
| `PORT` | Server port (default 8080) | `8080` |

## API Documentation

Swagger UI available at `/swagger-ui/index.html` when the app is running.
