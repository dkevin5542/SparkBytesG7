create table User(
    user_id INT PRIMARY KEY AUTO_INCREMENT, 
    email varchar(255) UNIQUE,
    diet ENUM('Vegetarian', 'Vegan', 'Omnivore', 'Pescatarian', 'Other') DEFAULT 'Omnivore',
    preferred_language ENUM('English', 'Mandarin', 'Arabic', 'Spanish')
); 

CREATE TABLE Event (
    event_id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    food_type ENUM('Snacks', 'Vegetarian', 'Vegan', 'Gluten-Free', 'Kosher', 'Halal', 'Other') DEFAULT 'Snacks',
    location VARCHAR(255) NOT NULL,
    address VARCHAR(255) NOT NULL
    event_date DATE NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES User(user_id) ON DELETE CASCADE
);