CREATE TABLE companies (
    name character varying(255) NOT NULL,
    cin character varying(255) NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);