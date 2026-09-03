# Event Management System - Backend Design

Based on the requirements in `idea.md`, the backend will act as a RESTful API serving data to the frontend, enforcing business logic, and managing interactions with the database.

## 1. Backend Technology Stack

*   **Runtime/Framework:** Node.js with Express.js (or Python with Django/FastAPI, Java with Spring Boot).
*   **Database:** PostgreSQL (using an ORM like Prisma or Sequelize) or MongoDB (using Mongoose).
*   **Authentication:** JSON Web Tokens (JWT) for secure, stateless user sessions.
*   **Password Hashing:** `bcrypt` to securely store user passwords.
*   **File Storage:** AWS S3 or Cloudinary (for storing event banners/images uploaded by Head Users).

## 2. Core API Endpoints

The API will be grouped into specific functional domains.

### A. Authentication (`/api/auth`)
*   `POST /api/auth/register`: Creates a new user (requires name, email, password, and `role` - Head User or Normal Viewer).
*   `POST /api/auth/login`: Authenticates a user and returns a JWT token.
*   `GET /api/auth/me`: Retrieves the profile of the currently logged-in user.

### B. Events (`/api/events`)
*   `GET /api/events`: Fetches a list of upcoming events. Open to all users (public). Supports query parameters for search/filtering (e.g., `?category=tech&date=2023-12-01`).
*   `GET /api/events/:eventId`: Fetches detailed information for a specific event. (Public)
*   `POST /api/events`: **(Protected - Head User Only)** Creates a new event.
*   `PUT /api/events/:eventId`: **(Protected - Head User Only)** Updates an existing event. Must be the creator of the event.
*   `DELETE /api/events/:eventId`: **(Protected - Head User Only)** Deletes an event.

### C. Registrations / Ticketing (`/api/registrations`)
*   `POST /api/events/:eventId/register`: **(Protected - Normal Viewer)** Registers the logged-in user for the specified event. Checks against `max_capacity`.
*   `DELETE /api/events/:eventId/register`: **(Protected - Normal Viewer)** Cancels a registration/RSVP.
*   `GET /api/users/:userId/registrations`: **(Protected - Normal Viewer)** Fetches all upcoming events a specific user is registered for.
*   `GET /api/events/:eventId/attendees`: **(Protected - Head User Only)** Fetches the list of all users registered for a specific event.

## 3. Security & Role-Based Access Control (RBAC)

Middleware functions will be implemented to secure routes based on the user's role:

1.  **`verifyToken`:** Middleware that checks if a valid JWT is present in the `Authorization` header. If missing or invalid, it returns a `401 Unauthorized`.
2.  **`isHeadUser`:** Middleware that checks the decoded JWT token to ensure the user's role is `HEAD_USER`. If not, it returns a `403 Forbidden`. Used on event creation/modification routes.
3.  **`isNormalViewer`:** Middleware that checks if the role is `NORMAL_VIEWER`. Used on registration routes.
4.  **`isEventOwner`:** Middleware that checks if the `Head User` attempting to edit/delete an event is the same one who created it.

## 4. Background Jobs & Services
*   **Email Notifications:** Integration with a service like SendGrid, Mailgun, or AWS SES to send emails for:
    *   Registration confirmations.
    *   Event updates or cancellations from the Head User.
    *   Reminders 24 hours before an event starts (Requires a CRON job / Task Scheduler).
