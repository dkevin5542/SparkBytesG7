# Spark Bytes Project Plan

### Project Overview

- **Project Name**: Spark Bytes  
- **Date**: 10/15/2024  
- **Authors**: Ming Hill, Kevin Dong, Dana Alzahed, Joshua Alvarez  

**Purpose**:  
Spark Bytes is a platform that allows Boston University students and faculty members to post events that offer free food or snacks. It helps reduce food waste from over-purchasing for events and gives students access to available free food. Students can RSVP to events and access details about food types, quantities, locations, and event times.

**Stakeholders**:  
Faculty members, students, and university administration.

---

## Requirements

### Functional Requirements

**Main Dashboard**:
- View events in either list or calendar format (Nylas and Google Calendar APIs).
- Sort/filter events by keyword, distance, dietary preferences, or date/time.
- RSVP to events.
- Favorite/bookmark events of interest.

**Login System**:
- Use Google Login API for BU email verification.

**Notifications**:
- Receive notifications for new events and RSVPs via in-app, email, or SMS.
- Filter notifications by location, time, food type, or quantity.

**Dietary Selection**:
- Filter events by dietary needs (gluten-free, kosher, vegetarian, vegan).
- View ingredients and allergy details for events.

**Terms/Conditions**:
- Users must sign a terms and conditions agreement before using the platform.

**User Profile**:
- Edit profile information and select preferred language (English, Mandarin, Arabic, Spanish).
- Set default dietary preferences.

**Google Maps Redirection**:
- Redirect to Google Maps with prefilled event location and user’s current location.

**Event Posting**:
- Only authorized users can post official events.
- Students can post unofficial events if they have extra food.
  
**Feedback/Rating System**:
- Provide feedback after attending events.

**Customization**:
- Enable light/dark mode for the dashboard.

### Non-Functional Requirements

- **Usability**: Simple, intuitive, and responsive user interface.
- **Performance**: Load in under 5 seconds; filters and sorting should update in under 3 seconds. Maintain 99.9% uptime.
- **Security**: Use Single Sign-On (SSO) with BU accounts, support 2-factor authentication, encrypt data at rest and in transit (HTTPS).

---

## Technical Requirements

**Front-End**:  
React/Next.js, TypeScript, CSS

**Back-End**:  
Express, Python Flask, JavaScript

**APIs**:  
Google Authentication, Google Maps, Calendar API

**Database**:  
TBD (local development uses JSON files)

---

## Constraints and Assumptions

- **Constraints**:  
  Must comply with BU policies, work within the given time and budget constraints.
  
- **Assumptions**:  
  Users will have an internet connection, up-to-date technology, and share their location.

---

## Risks

- **Data Security**: Sensitive data like personal information, school credentials, and location could be compromised. Mitigate by encrypting data and securing authentication.
- **Low User Engagement**: Students may not use the app or event coordinators may not post events. Mitigate by collecting user feedback and marketing the app effectively.

---

## Resources

| Name       | Role           |
|------------|----------------|
| Ming Hill  | Full-Stack Dev  |
| Dana Alzahed| Full-Stack Dev  |
| Kevin Dong | Full-Stack Dev  |
| Joshua Alvarez | Full-Stack Dev |

---

## Task Breakdown

| Task ID | Task                        | Description                                                   | Sprint | Status      |
|---------|-----------------------------|---------------------------------------------------------------|--------|-------------|
| 1       | Main Dashboard Interface     | Design and develop the main dashboard.                        | 1-8    | Not Started |
| 2       | Login/Signup System          | Develop login/signup functionality for users.                 | 1-8    | Not Started |
| 3       | Notification System          | Set up email notifications for events.                        | 2-6    | Not Started |
| 4       | Backend-Frontend Integration | Ensure all APIs and logic work with frontend.                 | 1-8    | Not Started |
| 5       | Posting System               | Allow users to post events with details.                      | 2-4    | Not Started |
| 6       | Terms and Conditions Page    | Write a terms and conditions page.                            | 2      | Not Started |
| 7       | User Profile Page            | Design user profile page.                                      | 2-3    | Not Started |
| 8       | Filter System                | Develop filters for dietary preferences and event details.     | 3-4    | Not Started |
| 9       | Search Bar                   | Create a search bar for finding specific events.               | 2-3    | Not Started |
| 10      | Feedback System              | Enable feedback submission for events.                        | 8      | Not Started |
| 11      | Customization                | Add a light/dark mode toggle for the dashboard.               | 8      | Not Started |

---

## Communication Plan

- **Regular Meetups**:  
  Fridays, 10:10 a.m. – 11:00 a.m. at the CDS lounge (6th floor).
  
- **Alternative Meetups**:  
  Zoom meetings if in-person is not possible. Additional 30-minute meetups as needed.
  
- **Daily Standups**:  
  Quick updates via text messaging for daily check-ins or questions.

**Contacts**:  
- Kevin: 718-316-8052, dkevin@bu.edu  
- Dana: 617-901-1450, dalzahed@bu.edu  
- Ming: 415-996-5446, soongming18@gmail.com  
- Josh: 917-376-4766, jhsualva@bu.edu

**Plan PDF**:
https://docs.google.com/document/d/1S-pkiME5mpSl4LjW3-oMaZRR3N4QtPy0eBoPkBK5dTw/edit?usp=sharing
