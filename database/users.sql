CREATE DATABASE harison;

CREATE TABLE users (
  ID SERIAL PRIMARY KEY,
  issuer VARCHAR(200), 
  email VARCHAR(50),
);

INSERT INTO users (issuer, email) VALUES (null, 'german.maxim@gmail.com');