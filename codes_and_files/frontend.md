# Event Management System - Frontend Design

Based on the requirements in `idea.md`, the frontend will be designed to cater to two primary roles: **Head Users** (Organizers) and **Normal Viewers** (Attendees), alongside public views for unauthenticated users.

## 1. Frontend Technology Stack

*   **Framework/Library:** React.js, Vue.js, or Next.js (for better SEO on public event pages).
*   **Styling:** Tailwind CSS (for rapid UI development) or custom CSS modules.
*   **State Management:** Context API or Redux (to manage user session, authentication tokens, and shared event data).
*   **Routing:** React Router (if using React) or Next.js App Router.

## 2. Key Pages & Routes

### Public Pages (Unauthenticated)
*   **`/` (Landing Page):** Welcome screen highlighting upcoming featured events and a call-to-action to sign up.
*   **`/login`:** User login form (Email and Password).
*   **`/signup`:** User registration form (includes an option to sign up as a *Head User* or *Normal Viewer*).
*   **`/events`:** Public catalog of upcoming events with search and basic filtering capabilities.

### Normal Viewer Pages (Attendee Role)
*   **`/events` (Logged In):** Similar to the public catalog but allows the user to click "Register" or "RSVP".
*   **`/events/:eventId` (Event Details):** Detailed view of a specific event (date, venue, description, capacity) with a prominent "Register" button.
*   **`/dashboard/my-events` (Personal Dashboard):** 
    *   List of upcoming events the user has registered for.
    *   History of past attended events.
*   **`/profile`:** User settings (update name, email, password).

### Head User Pages (Organizer Role)
*   **`/admin/dashboard`:** High-level analytics (Total events created, total attendees registered across all events).
*   **`/admin/events`:** List of all events created by this Head User. Includes options to Edit or Delete.
*   **`/admin/events/new`:** "Create Event" form (Inputs for Title, Description, Date, Time, Venue, Capacity, Image Upload).
*   **`/admin/events/:eventId/edit`:** Form to modify an existing event.
*   **`/admin/events/:eventId/attendees`:** A table/list view showing all Normal Viewers registered for a specific event. Includes tools to manage or export the list.

## 3. Core UI Components

To maintain consistency and speed up development, the following reusable UI components should be built:

*   **`Navbar`:** Responsive navigation bar. Displays different links based on the user's authentication status and role (e.g., showing a "Create Event" button only to Head Users).
*   **`EventCard`:** A visual component used on listing pages to display a quick summary of an event (Thumbnail image, Title, Date, Location).
*   **`Modal`:** Used for confirmations (e.g., "Are you sure you want to delete this event?" or "Registration Successful!").
*   **`Button` / `Input` / `Select`:** Standardized form elements to ensure a uniform look and feel across the application.
*   **`DataTable`:** A sortable/paginated table component specifically for the Head User to manage attendees easily.

## 4. State Management Needs

The frontend will need to manage the following global states:
1.  **Auth State:** `isAuthenticated` (boolean), `userRole` (Head User / Normal Viewer), `userId`, and the JWT token.
2.  **Notification State:** A global toast/notification system to show success/error messages (e.g., "Event created successfully," or "Failed to register").
