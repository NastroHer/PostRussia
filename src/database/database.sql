CREATE DATABASE db;

\l;

\c db;

CREATE TABLE users(
  hobbies text[],
  phone VARCHAR(255) UNIQUE,
  email VARCHAR(255) UNIQUE,
  name VARCHAR(255) NOT NULL,
  created timestamp NOT NULL,
  gender VARCHAR(255) NOT NULL,
  avatar_webp text DEFAULT '',
  avatar_jpeg text DEFAULT '',
  password VARCHAR(255) NOT NULL,
  id uuid DEFAULT uuid_generate_v4(),
  PRIMARY KEY(id)
);