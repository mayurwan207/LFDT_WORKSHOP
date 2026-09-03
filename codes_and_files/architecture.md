# Event Management System - Architecture

## 1. High-Level Architecture Overview

The system will follow a standard **Three-Tier Architecture**, consisting of a Client (Frontend), an Application Server (Backend API), and a Database. 

```mermaid
graph TD
    Client[Client Browser / Mobile App]
    subgraph Frontend
        UI[User Interface]
        State[State Management]
    end
    subgraph Backend API
        Auth[Authentication Service]
        EventManager[Event Management Service]
        TicketManager[Registration/Ticketing Service]
        NotifManager[Notification Service]
    end
    subgraph Database
        DB[(Primary Database)]
    end

    Client <--> Frontend
    Frontend <--> |REST / GraphQL| Backend API
    Auth <--> DB
    EventManager <--> DB
    TicketManager <--> DB
    NotifManager -.-> |Emails/Push| Client
```

## 2. Technology Stack (Proposed)

*   **Frontend (Presentation Layer):** React.js or Vue.js. This will handle the UI for both Head Users (dashboard) and Normal Viewers (event browsing).
*   **Backend (Business Logic Layer):** Node.js with Express (or Python with Django/FastAPI). This layer will expose RESTful APIs to handle requests from the frontend, validate data, and enforce business rules (e.g., checking role permissions).
*   **Database (Data Access Layer):** PostgreSQL (Relational) or MongoDB (NoSQL). A relational database is recommended here to easily manage the relationships between Users, Events, and Registrations.

## 3. Core Database Entities & Relationships

To support the features outlined in `idea.md`, the database will need the following core entities:

### `User` Table
*   `id` (Primary Key)
*   `name` (String)
*   `email` (String, Unique)
*   `password_hash` (String)
*   `role` (Enum: `HEAD_USER`, `NORMAL_VIEWER`)

### `Event` Table
*   `id` (Primary Key)
*   `head_user_id` (Foreign Key -> User.id)
*   `title` (String)
*   `description` (Text)
*   `date_time` (Timestamp)
*   `venue` (String)
*   `max_capacity` (Integer)
*   `current_capacity` (Integer)

### `Registration` (or `Ticket`) Table
*   `id` (Primary Key)
*   `event_id` (Foreign Key -> Event.id)
*   `user_id` (Foreign Key -> User.id)
*   `registration_date` (Timestamp)
*   `status` (Enum: `CONFIRMED`, `WAITLISTED`, `CANCELLED`)

## 4. Key Workflows

### Authentication Flow
1. User submits credentials (email/password).
2. Backend validates against the `User` table.
3. Backend returns a JWT (JSON Web Token) containing the user's ID and `role`.
4. Frontend stores the token and includes it in the header of subsequent API requests.

### Event Creation Flow (Head User)
1. Head User submits an event creation form.
2. Frontend sends a `POST /events` request with the JWT.
3. Backend checks if the JWT role is `HEAD_USER`.
4. Backend inserts a new row into the `Event` table.

### Registration Flow (Normal Viewer)
1. Normal Viewer clicks "Register" on an event.
2. Frontend sends a `POST /events/{event_id}/register` request.
3. Backend checks if `current_capacity < max_capacity` for the event.
4. If space is available, Backend creates a `Registration` record and increments `current_capacity`.
5. Notification Service sends a confirmation email to the user.
