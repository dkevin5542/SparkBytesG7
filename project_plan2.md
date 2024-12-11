# Team 7 Project Plan

## 1. Requirements

### Introduction:

- **Project Name**: Spark Bytes
- **Date**: 10/15/2024
- **Authors**: Ming Hill, Kevin Dong, Dana Alzahed, Joshua Alvarez
- **Purpose**: Spark Bytes is a software platform that allows faculty members to post events offering free food and snacks. Students can RSVP, bookmark, and access details about these events, including dietary preferences, location, and time. The goal is to reduce food waste and provide students with opportunities for free food.
- **Stakeholders**: Faculty members, students, university administration.

### Scope:

- **Problem/Opportunity**: Spark Bytes helps reduce food waste from over-purchasing for events and provides students with access to free food.
- **Target Audience**: Boston University students and faculty members with BU emails.
- **Use Cases**: 
    - As a user, I want to know the location and type of food available at an event so I can attend events that fit my dietary preferences.
    - As a faculty member, I want to post events to share surplus food.

### Functional Requirements:

- **Main Dashboard**:
    - View upcoming events with details like location, time, and dietary preferences.
    - Filter and sort events by keywords, dietary needs, or time.
    - RSVP and favorite events.
- **Login System**:
    - JWT-based login system with email validation.
    - Login requires BU email addresses.
- **Notifications**:
    - Receive notifications for new events or RSVPs via email.
- **Dietary Selection**:
    - Filter events by dietary options (gluten-free, vegetarian, etc.).
    - Set dietary preferences in the profile.
- **Terms/Conditions Page**:
    - Users must agree to terms before using the application.
- **User Profile**:
    - Edit profile with name, bio, interests, dietary preferences, and language.
    - Store and retrieve dietary preferences from the backend.
- **Event Posting**:
    - Registered members can post official events with dietary needs and times.
- **RSVP Management**:
    - RSVP to events, view your RSVP'd events, and see other attendees for events.
- **Favorites**:
    - Bookmark favorite events and retrieve a list of favorites.
- **Frontend Features**:
    - Responsive UI with React/Next.js.
    - Components for event cards, favorites, and profile management.

### Non-Functional Requirements:

- **Usability**:
    - Simple and intuitive interface, responsive design for various screen sizes.
- **Performance**:
    - Load time under 5 seconds, filters and sorting within 3 seconds.
    - Scalable as users and data increase.
    - 99.9% uptime.
- **Security**:
    - Secure token authentication (JWT stored in cookies).
    - HTTPS used for secure transmission.

### Technical Requirements:

- **Front-End**:
    - React/Next.js, Typescript, CSS.
- **Back-End**:
    - Python Flask
- **Database**:
    - SQLite3

### Constraints and Assumptions:

- **Constraints**:
    - Budget, compliance with BU policies, time limitations.
- **Assumptions**:
    - Students will use the application regularly, with internet access and up-to-date technology.

### Risks:

- **Data Security**:
    - The app handles sensitive user data (personal info, school credentials, location). Encryption and secure authentication are critical to mitigate breaches.
- **Low User Adoption**:
    - Surveys and user feedback can inform improvements. Marketing will raise awareness of the app.

## 2. Resources

| Name  | Role            |
|-------|-----------------|
| Ming  | Full-Stack Dev   |
| Dana  | Full-Stack Dev   |
| Kevin | Full-Stack Dev   |
| Josh  | Full-Stack Dev   |

## 3. Task Breakdown

| Phase          | Deliverables             | Tasks                                                 | Timeline | Resources  |
|----------------|--------------------------|-------------------------------------------------------|----------|------------|
| **Planning**   | Requirements Document     | Define project goals, requirements, stakeholders       | Sprint 1 | All Members|
| **Design**     | System Design Document    | Collect APIs, create UI prototypes, system design doc  | Sprint 2-3 | All Members|
| **Development**| Code Modules, Unit Tests  | Develop frontend with React/Next.js, backend with Flask/Express, integrate APIs and systems | Sprint 4-5 | All Members|
| **Testing**    | Test Cases, Reports       | Test for bugs, data leaks, scalability, and performance | Sprint 6  | All Members|
| **Deployment** | Completed Web App         | Deploy app, write user manuals, finalize documentation | Sprint 7  | All Members|

## 4. Schedule

| Task ID | Task Description                      | Sprint | Status    |
|---------|----------------------------------------|--------|-----------|
| 1       | Design main dashboard interface        | 1-8    | Not Started |
| 2       | Develop login/signup system            | 1-8    | Not Started |
| 3       | Create user profile managment           | 2-6    | Not Started |
| 4       | Develop event posting system            | 1-8    | Not Started |
| 5       | Connect backend to frontend          | 2-4    | Not Started |
| 6       | Create user profile page        | 2      | Not Started |
| 7       | Finish implementing profile fields           | 2-3    | Not Started |
| 8       | Develop RSVP system          | 3-4    | Not Started |
| 9       | Implement event posting              | 2-3    | Not Started |
| 10      | Create favorites management                | 8      | Not Started |

## 5. Communication Plan

- **Regular Meetups**:
    - Every Friday, 10:10 a.m. - 11:00 a.m., in the lab.
    - Additional meetups if needed in CDS lounge.
- **Exceptions**:
    - Use Zoom if unable to meet in person. Notify group if unable to attend.
- **Daily Standups**:
    - Use text messaging for quick updates and questions.

### Contacts:

- **Kevin**: 718-316-8052, dkevin@bu.edu
- **Dana**: 617-901-1450, dalzahed@bu.edu
- **Ming**: 415-996-5446, soongming18@gmail.com
- **Josh**: 917-376-4766, jhsualva@bu.edu
