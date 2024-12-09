-- User information

CREATE TABLE User(
    user_id INTEGER PRIMARY KEY AUTOINCREMENT,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT UNIQUE NOT NULL,
    bu_id TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    bio TEXT,
    interests TEXT,
    language TEXT DEFAULT 'English'
    -- diet (assoc table)
); 

-- Event information
CREATE TABLE Event (
    event_id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    title TEXT NOT NULL,
    description TEXT,
    quantity INTEGER DEFAULT 0,
    location TEXT NOT NULL,
    address TEXT NOT NULL,
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);

-- Food types 
CREATE TABLE FoodTypes (
    food_type_id INTEGER PRIMARY KEY AUTOINCREMENT,
    food_type_name TEXT UNIQUE NOT NULL
);

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
    user_id INTEGER NOT NULL,
    food_type_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, food_type_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (food_type_id) REFERENCES FoodTypes(food_type_id) ON DELETE CASCADE
);

-- Favorite event information
CREATE TABLE Favorite (
    user_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    PRIMARY KEY (user_id, event_id),
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE
);

-- RSVP information
CREATE TABLE RSVP (
    rsvp_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    rsvp_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    status TEXT CHECK(status IN ('Going', 'Interested', 'Not Going')) DEFAULT 'Going',
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE
);

-- Review information
CREATE TABLE Review (
    Review_id INTEGER PRIMARY KEY,
    user_id INTEGER NOT NULL,
    event_id INTEGER NOT NULL,
    rating INTEGER CHECK(rating BETWEEN 1 AND 5),
    comments TEXT,
    feedback_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE,
    FOREIGN KEY (event_id) REFERENCES Event(event_id) ON DELETE CASCADE
);