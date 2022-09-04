CREATE USER searchApp;

CREATE DATABASE companylist;

GRANT ALL PRIVILEGES ON DATABASE companylist TO searchApp;

\c companylist searchApp;

CREATE TABLE companies (
    name character varying(255) NOT NULL,
    cin character varying(255) NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);