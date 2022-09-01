CREATE TABLE companies (
    company_name character varying(255) NOT NULL,
    company_CIN character varying(255) NOT NULL PRIMARY KEY,
    created_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL,
    updated_at timestamp with time zone DEFAULT CURRENT_TIMESTAMP NOT NULL
);