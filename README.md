# CS391 Documentation

## Documentation: [Project Plan](https://github.com/dkevin5542/SparkBytesG7/blob/rework/project_plan.md)

### Usage
Spark Bytes is a software platform that allows faculty members to post events offering free food and snacks. Students can RSVP and access details about these events, including the type and quantity of food, location, and time.

If ypu want a more deatailed documentaion, click [here](https://docs.google.com/document/d/1M3eSCR9I4OHm3ZlkWRKJBUXCAXKYUQEbtd5OQ0mwtz8/edit?usp=sharing)

---

## Installation Guide

Before attempting to clone this repository to use the application, ensure you have **Node.js** installed on your machine, as this project runs on **Next.js** and **React** for the front-end. For the back-end, you need **Flask** installed on your machine.

### Node Installation
Refer to the [Node.js installation guide](https://nodejs.org/en/download/package-manager).

### Next.js Installation
Refer to the [Next.js documentation](https://nextjs.org/docs/app/getting-started/installation).

### Flask Installation
Refer to the [Flask documentation](https://flask.palletsprojects.com/en/stable/installation/).

### Notes
- This documentation assumes you have Python installed on your machine and basic knowledge of Git and terminal commands.

### Steps
1. Clone the repository to your local machine.
2. Navigate to the `/front-end/sparkbytesg7` directory.
3. Run `npm install` to install all necessary libraries.
4. Open two terminal instances:
   - **Front-End Steps**:
     1. Navigate to `/front-end/sparkbytesg7`.
     2. Run `npm run dev`.
     3. Open [http://localhost:3000](http://localhost:3000) in your browser.
   - **Back-End Steps**:
     1. Navigate to `/back-end`.
     2. Run `python main.py`.

---

## Design/Architecture

### Front-End
- **Technologies**: React, Next.js, Node.js, CSS, TypeScript

### Back-End
- **Technologies**: SQLite, Flask, Python

### Infrastructure
- **Single-Page Application (SPA)**: Uses SPA architecture. Each component is dynamically replaced without reloading pages.
- **Database**: SQLite

---

## Technical Specifications
- **Python**: v3.11.2
- **Flask**: v3.0.0
- **Node.js**: v18.18.2
- **React**: v19.0.0
- **Next.js**: v15.0.1

---

## Interfaces

### Front-End Files
- **`src/app`**: Contains all front-end components.
  - **`about`**: About page logic (`page.tsx`).
  - **`all_rsvp`**: Displays events the user RSVP'd for.
  - **`components`**:
    - `dashboard.tsx`: Manages dashboard layout (currently unused).
    - `eventcard.tsx`: Styles event cards and handles event redirection.
    - `eventform.tsx`: Handles event creation and storage.
    - `eventlist.tsx`: Formats event cards into a list.
    - `favorite_button.tsx`: Handles user favorites.
    - `nav-bar.tsx`: Navigation bar logic and logout functionality.
  - **`contact`**: Displays contact information.
  - **`create-event`**: Form for posting new events.
  - **`favorites`**: Displays user favorite events.
  - **`fonts`**: Custom font files.
  - **`login`**: Manages login logic and redirection.
  - **`logout`**: Currently unused.
  - **`posted_events`**: Displays user-created events.
  - **`rsvpform`**: RSVP form logic.
  - **`styles`**: Contains CSS files for the application.
  - **`page.tsx`**: Home page or root page logic.

### Back-End Files
- **`main.py`**: Flask application entry point.
- **`auth`**: Handles tokens and authentication.
- **`data`**: SQLite database files.
- **`flask_session`**: Flask session files.
- **`routes`**:
  - `auth_routes.py`: Authentication-related routes.
  - `event_routes.py`: Event-related routes.
  - `favorite_routes.py`: Favorite-related routes.
  - `review_routes.py`: Review-related routes (not implemented).
  - `rsvp_routes.py`: RSVP-related routes.
  - `user_route.py`: User-related routes.

---

## Database
This application uses **SQLite** as its database. Learn more about SQLite [here](https://www.sqlite.org/).

---

## Troubleshooting

1. **Front-End Issues**
   - Ensure you are in the `/front-end/sparkbytesg7` directory.
   - Run `npm install` to install missing packages.

2. **Back-End Issues**
   - Check that necessary libraries (e.g., SQLite, JWT) are installed.

3. **Contact Team Members**
   - Kevin: 7183168052, [dkevin@bu.edu](mailto:dkevin@bu.edu) (Front-End)
   - Dana: 6179011450, [dalzahed@bu.edu](mailto:dalzahed@bu.edu) (Front-End)
   - Ming: 4159965446, [soongming18@gmail.com](mailto:soongming18@gmail.com) (Back-End)
   - Josh: 9173764766, [jhsualva@bu.edu](mailto:jhsualva@bu.edu) (Back-End)
