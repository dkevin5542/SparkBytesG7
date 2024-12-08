-- User information

CREATE TABLE User(
    user_id TEXT PRIMARY KEY,
    bu_id varchar(10) UNIQUE,
    email varchar(255) UNIQUE NOT NULL,
    name TEXT,
    bio TEXT,
    interests TEXT,
    --
    diet TEXT CHECK(diet IN ('Vegetarian', 'Vegan', 'Omnivore', 'Pescatarian', 'Other')) DEFAULT 'Omnivore',
    preferred_language TEXT CHECK(preferred_language IN ('English', 'Mandarin', 'Arabic', 'Spanish')) DEFAULT 'English',
    --
   role TEXT CHECK(role IN ('Student', 'Faculty')) DEFAULT 'Student'

); 

-- Event information
CREATE TABLE Event (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id TEXT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    quantity INTEGER DEFAULT 0,
    location VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    event_type TEXT CHECK(event_type IN ('Faculty', 'Student')) NOT NULL,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- Food types 
CREATE TABLE FoodTypes (
    food_type_id INTEGER PRIMARY KEY AUTOINCREMENT,
    food_type_name TEXT UNIQUE NOT NULL
);

-- Languages
CREATE TABLE Languages (
    language_id INTEGER PRIMARY KEY AUTOINCREMENT,
    language_name TEXT UNIQUE NOT NULL
);

INSERT INTO Languages (language_name) VALUES
('English'),
('Spanish'),
('Arabic'),
('Mandarin'),
('Other');

INSERT INTO FoodTypes (food_type_name) VALUES 
('Snacks'), 
('Vegetarian'), 
('Vegan'), 
('Gluten-Free'), 
('Kosher'), 
('Halal'), 
('Dairy-Free'),
('Nut-Free'),
('Soy-Free'),
('Other');

-- Assoc table food types and events
CREATE TABLE EventFoodTypes (
    event_id INTEGER NOT NULL,
    food_type_id INTEGER NOT NULL,
    PRIMARY KEY (event_id, food_type_id),
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE,
    FOREIGN KEY (food_type_id) REFERENCES FoodTypes(food_type_id) ON DELETE CASCADE
);

-- Assoc table food types (diet) and user

CREATE TABLE UserFoodTypes (
    user_id TEXT NOT NULL,
    food_type_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, food_type_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (food_type_id) REFERENCES FoodTypes(food_type_id) ON DELETE CASCADE
);

-- Assoc table preferred languages (lang) and user

CREATE TABLE UserLanguages (
    user_id TEXT NOT NULL,
    language_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, language_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (language_id) REFERENCES Languages(language_id) ON DELETE CASCADE
);

-- Favorite event information
CREATE TABLE Favorite (
    user_id TEXT NOT NULL,
    event_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE
);

-- RSVP information
CREATE TABLE RSVP (
    rsvp_id INTEGER PRIMARY KEY,
    user_id TEXT NOT NULL,
    event_id INTEGER NOT NULL,
    rsvp_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK(status IN ('Going', 'Interested', 'Not Going')) DEFAULT 'Going',
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE
);

-- Review information
CREATE TABLE Review (
    Review_id INTEGER PRIMARY KEY,
    user_id TEXT NOT NULL,
    event_id INTEGER NOT NULL,
    rating INTEGER CHECK(rating BETWEEN 1 AND 5),
    comments TEXT,
    feedback_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE
);

-- INSERT statements for dummy test data
INSERT INTO User (user_id, bu_id, email, diet, preferred_language, role) VALUES
    ('alvin_google_id', 'U123456789', 'alvinb@bu.edu', 'Vegetarian', 'English', 'Faculty'),
    ('barry_google_id', 'U223456789', 'barryc@bu.edu', 'Vegan', 'Mandarin', 'Student'),
    ('charlie_google_id', 'U323456789', 'charlied@bu.edu', 'Omnivore', 'Spanish', 'Student'),
    ('daniele_google_id', 'U423456789', 'daniele@bu.edu', 'Pescatarian', 'Arabic', 'Faculty'),
    ('evief_google_id', 'U523456789', 'evief@bu.edu', 'Other', 'English', 'Faculty');

INSERT INTO Event (user_id, title, description, quantity, location, address, event_date, start_time, end_time, event_type) VALUES
    ('alvin_google_id', 'Vegetarian Event', 'A gathering for all vegetarian enthusiasts.', 35, 'College of Arts and Sciences', '725 Commonwealth Ave', '2024-11-01', '12:00:00', '14:00:00', 'Faculty'),
    ('barry_google_id', 'Vegan Lunch', 'Enjoy vegan dishes from around the world.', 30, 'George Sherman Union', '855 Commonwealth Ave', '2024-11-02', '13:00:00', '15:00:00', 'Faculty'),
    ('charlie_google_id', 'Fine Arts Dinner', 'Dinner event with mixed food choices.', 50, 'College of Fine Arts', '789 Maple Ave', '2024-11-03', '18:00:00', '20:00:00', 'Faculty'),
    ('daniele_google_id', 'BU Beach Picnic', 'Picnic with snacks.', 'Snacks', 17, '270 Bay State Road', '2024-11-04', '10:00:00', '12:00:00', 'Student'),
    ('evief_google_id', 'Snacks and Books', 'Casual book club meetup with snacks.', 10, 'Mugar Library', '775 Commonwealth Avenue', '2024-11-05', '15:00:00', '17:00:00', 'Student');

-- Vegetarian Event
INSERT INTO EventFoodTypes (event_id, food_type_id) VALUES
    (1, 2); -- Vegetarian

-- Vegan Lunch (Vegan and Vegetarian)
INSERT INTO EventFoodTypes (event_id, food_type_id) VALUES
    (2, 2), -- Vegetarian
    (2, 3); -- Vegan

-- Fine Arts Dinner
INSERT INTO EventFoodTypes (event_id, food_type_id) VALUES
    (3, 7); -- Other

-- BU Beach Picnic
INSERT INTO EventFoodTypes (event_id, food_type_id) VALUES
    (4, 1); -- Snacks

-- Snacks and Books
INSERT INTO EventFoodTypes (event_id, food_type_id) VALUES
    (5, 1); -- Snacks

INSERT INTO Favorite (user_id, event_id) VALUES
    ('alvin_google_id', 2),
    ('alvin_google_id', 3),
    ('barry_google_id', 1),
    ('charlie_google_id', 4),
    ('daniele_google_id', 5),
    ('evief_google_id', 1),
    ('evief_google_id', 3);

INSERT INTO RSVP (user_id, event_id, status) VALUES
    ('alvin_google_id', 1, 'Going'),
    ('barry_google_id', 2, 'Interested'),
    ('charlie_google_id', 3, 'Going'),
    ('daniele_google_id', 4, 'Not Going'),
    ('evief_google_id', 5, 'Going'),
    ('alvin_google_id', 5, 'Interested'),
    ('barry_google_id', 3, 'Going');

INSERT INTO Review (user_id, event_id, rating, comments) VALUES
    ('alvin_google_id', 1, 5, 'Great event!'),
    ('barry_google_id', 2, 4, 'Nice vegan options.'),
    ('charlie_google_id', 3, 3, 'Good, but could be better.'),
    ('daniele_google_id', 4, 2, 'Not what I expected.'),
    ('evief_google_id', 5, 5, 'Loved the snacks and discussions.'),
    ('alvin_google_id', 3, 1, 'Kinda sucked.'),
    ('barry_google_id', 4, 3, 'Average experience.');
