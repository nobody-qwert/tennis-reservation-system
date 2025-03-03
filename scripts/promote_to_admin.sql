-- Promote a user to admin
UPDATE users SET is_admin = TRUE WHERE username = 'REPLACE_WITH_YOUR_USERNAME';

-- Verify the change
SELECT id, username, email, is_admin FROM users;