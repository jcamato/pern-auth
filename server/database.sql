--sign into postgresql
$ psql -U postgres
--list databases
# \l
--expanded display
# \x on
--show relations
# \dt

--create database
CREATE DATABASE jwttutorial;

--delete database
DROP DATABASE name_here;

--connect to database
# \c jwttutorial
--quit
# \q

--set extention
create extension if not exists "uuid-ossp";

--create users table
CREATE TABLE users (
  user_id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_name VARCHAR(255) NOT NULL,
  user_email VARCHAR(255) NOT NULL,
  user_password VARCHAR(255) NOT NULL
);

--insert fake users
INSERT INTO users (user_name, user_email, user_password)
  VALUES ('henry', 'henry@email.com', 'password');

--delete a user
delete from users where user_name = 'jacob';