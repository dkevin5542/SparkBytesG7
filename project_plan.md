# Team 7 Project Plan

## 1. Requirements

### Introduction:

- **Project Name**: Spark Bytes
- **Date**: 10/15/2024
- **Authors**: Ming Hill, Kevin Dong, Dana Alzahed, Joshua Alvarez
- **Purpose**: Spark Bytes is a software platform that allows faculty members to post events offering free food and snacks. Students can RSVP and access details about these events, including the type and quantity of food, location, and time. The goal is to reduce food waste and provide students with opportunities for free food.
- **Stakeholders**: Faculty members, students, university administration.

### Scope:

- **Problem/Opportunity**: Spark Bytes helps reduce food waste from over-purchasing for events and provides students with access to free food.
- **Target Audience**: Boston University students and faculty members with BU emails.
- **Use Cases**: 
    - As a user, I want to know the location and type of food available at an event so I can attend events that fit my dietary preferences.

### Functional Requirements:

- **Main Dashboard**:
    - Switch between list and calendar view of upcoming events.
    - Sort or filter events by keywords, distance, dietary needs, date/time.
    - RSVP to events.
    - Favorite/bookmark events.
- **Login System**:
    - Google Login API to verify BU emails.
- **Notifications**:
    - Receive notifications for new events or RSVPs via in-app, email, or SMS.
    - Filter notifications by location, time, food type, etc.
- **Dietary Selection**:
    - Filter events by dietary options (gluten-free, kosher, vegetarian, etc.).
    - Preset filters for future use.
- **Terms/Conditions Page**:
    - Users must agree to terms before using the application.
- **User Profile**:
    - Edit profile information and dietary settings.
    - Set preferred language (English, Mandarin, Arabic, Spanish).
- **Google Maps Redirection**:
    - Redirect to Google Maps for event location.
- **Event Posting**:
    - Authorized users can post official events.
    - Students can post unofficial events if they have extra food.
- **Feedback/Rating System**:
    - Users can provide feedback after attending events.
- **Customization**:
    - Switch between light and dark mode for the dashboard.

### Non-Functional Requirements:

- **Usability**:
    - Simple and intuitive interface, responsive design for various screen sizes.
- **Performance**:
    - Load time under 5 seconds, filters and sorting within 3 seconds.
    - Scalable as users and data increase.
    - 99.9% uptime.
- **Security**:
    - Use BU Single Sign-On, optional 2-factor authentication.
    - Encrypt data in transit and at rest.
    - Comply with data protection laws and university regulations.

### Technical Requirements:

- **Front-End**:
    - React/Next.js, Typescript, CSS.
- **Back-End**:
    - Express, Python Flask, JavaScript.
- **APIs**:
    - Google Authentication, Google Maps, Calendar API.
- **Database**:
    - TBD (local JSON file for now).

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
| 3       | Set up notification system             | 2-6    | Not Started |
| 4       | Connect backend with frontend          | 1-8    | Not Started |
| 5       | Develop event posting system           | 2-4    | Not Started |
| 6       | Write terms and conditions page        | 2      | Not Started |
| 7       | Create user profile page               | 2-3    | Not Started |
| 8       | Create event filter system             | 3-4    | Not Started |
| 9       | Add search bar to navbar               | 2-3    | Not Started |
| 10      | Create feedback system                 | 8      | Not Started |
| 11      | Add light/dark mode customization      | 8      | Not Started |

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
