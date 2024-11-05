CREATE TABLE User(
    user_id INTEGER PRIMARY KEY,
    email varchar(255) UNIQUE NOT NULL,
    diet TEXT CHECK(diet IN ('Vegetarian', 'Vegan', 'Omnivore', 'Pescatarian', 'Other')) DEFAULT 'Omnivore',
    preferred_language TEXT CHECK(preferred_language IN ('English', 'Mandarin', 'Arabic', 'Spanish')) DEFAULT 'English'
); 

CREATE TABLE Event (
    event_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    food_type TEXT CHECK(food_type IN ('Snacks', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Kosher', 'Halal', 'Other')) DEFAULT 'Snacks',
    location VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,

    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- INSERT statements for dummy test data
INSERT INTO User (email, diet, preferred_language) VALUES
    ('alvinb@bu.edu', 'Vegetarian', 'English'),
    ('barryc@bu.edu', 'Vegan', 'Mandarin'),
    ('charlied@bu.edu', 'Omnivore', 'Spanish'),
    ('daniele@bu.edu', 'Pescatarian', 'Arabic'),
    ('evief@bu.edu', 'Other', 'English');

INSERT INTO Event (user_id, title, description, food_type, location, address, event_date, start_time, end_time) VALUES
    (1, 'Vegetarian Event', 'A gathering for all vegetarian enthusiasts.', 'Vegetarian', 'College of Arts and Sciences', '725 Commonwealth Ave', '2024-11-01', '12:00:00', '14:00:00'),
    (2, 'Vegan Lunch', 'Enjoy vegan dishes from around the world.', 'Vegan', 'George Sherman Union', '855 Commonwealth Ave', '2024-11-02', '13:00:00', '15:00:00'),
    (3, 'Fine Arts Dinner', 'Dinner event with mixed food choices.', 'Other', 'College of Fine Arts', '789 Maple Ave', '2024-11-03', '18:00:00', '20:00:00'),
    (4, 'BU Beach Picnic', 'Picnic with snacks.', 'Snacks', 'BU Beach', '270 Bay State Road', '2024-11-04', '10:00:00', '12:00:00'),
    (5, 'Snacks and Books', 'Casual book club meetup with snacks.', 'Snacks', 'Mugar Library', '775 Commonwealth Avenue', '2024-11-05', '15:00:00', '17:00:00');