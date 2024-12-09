-- Insert dummy events into the Event table
INSERT INTO Event (user_id, title, description, quantity, location, address, event_date, start_time, end_time)
VALUES
(1, 'Vegan Cooking Class', 'Learn to cook vegan dishes.', 30, 'College of Arts and Sciences', '725 Commonwealth Ave', '2024-12-15', '10:00:00', '12:00:00'),
(2, 'Yoga and Smoothies', 'A yoga session followed by healthy smoothies.', 50, 'FitRec', '915 Commonwealth Ave', '2024-12-16', '08:00:00', '10:00:00'),
(3, 'Food Festival', 'Sample delicious foods from around the world.', 200, 'GSU', '775 Commonwealth Ave', '2024-12-17', '11:00:00', '16:00:00'),
(4, 'Cooking with Kids', 'A fun cooking workshop for kids.', 20, 'Wheelock College of Education', '2 Silber Way', '2024-12-18', '14:00:00', '16:00:00'),
(5, 'Gluten-Free Baking', 'Learn to bake without gluten.', 25, 'StuVi 1', '10 Buick St', '2024-12-19', '13:00:00', '15:00:00'),
(6, 'Keto Workshop', 'Discover keto-friendly recipes.', 40, 'FitRec', '915 Commonwealth Ave', '2024-12-20', '09:00:00', '11:00:00'),
(7, 'Halal Cuisine Tasting', 'Taste delicious halal dishes.', 70, 'Marciano Commons', '100 Bay State Rd', '2024-12-21', '18:00:00', '20:00:00'),
(8, 'Kosher Cooking 101', 'Learn kosher cooking basics.', 30, 'BU Hillel', '213 Bay State Rd', '2024-12-22', '15:00:00', '17:00:00'),
(9, 'Soy-Free Snacks', 'Prepare snacks free of soy.', 35, 'BU Beach', '270 Bay State Rd', '2024-12-23', '10:00:00', '12:00:00'),
(10, 'Holiday Desserts', 'Make festive holiday desserts.', 50, 'StuVi 2', '33 Harry Agganis Wy', '2024-12-24', '14:00:00', '16:00:00');

-- Insert associations into EventFoodTypes (linking events to dietary needs)
INSERT INTO EventFoodTypes (event_id, food_type_id)
VALUES
(1, (SELECT food_type_id FROM FoodTypes WHERE food_type_name = 'Vegan')),
(2, (SELECT food_type_id FROM FoodTypes WHERE food_type_name = 'Vegan')),
(3, (SELECT food_type_id FROM FoodTypes WHERE food_type_name = 'Vegetarian')),
(4, (SELECT food_type_id FROM FoodTypes WHERE food_type_name = 'Vegetarian')),
(5, (SELECT food_type_id FROM FoodTypes WHERE food_type_name = 'Gluten-Free')),
(6, (SELECT food_type_id FROM FoodTypes WHERE food_type_name = 'Gluten-Free')),
(7, (SELECT food_type_id FROM FoodTypes WHERE food_type_name = 'Halal')),
(8, (SELECT food_type_id FROM FoodTypes WHERE food_type_name = 'Kosher')),
(9, (SELECT food_type_id FROM FoodTypes WHERE food_type_name = 'Soy-Free')),
(10, (SELECT food_type_id FROM FoodTypes WHERE food_type_name = 'Vegetarian'));
