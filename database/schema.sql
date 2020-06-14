CREATE DATABASE harrison;

CREATE TABLE users (
    ID SERIAL PRIMARY KEY,
    issuer VARCHAR(200),
    email VARCHAR(50),
);

INSERT INTO users (issuer, email) VALUES (null, 'german.maxim@gmail.com');

CREATE TABLE labels (
    ID SERIAL PRIMARY KEY,
    value TEXT
);

CREATE TABLE images (
    ID SERIAL PRIMARY KEY,
    file_name VARCHAR(50),
    status VARCHAR(20),
    date DATE NOT NULL DEFAULT CURRENT_DATE
);

CREATE TABLE image_label (
   image_id integer references images(ID),
   label_id integer references labels(ID),
   PRIMARY KEY(image_id, label_id)
);
