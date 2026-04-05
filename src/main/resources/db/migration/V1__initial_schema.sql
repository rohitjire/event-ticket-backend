-- Users table
CREATE TABLE users (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Events table
CREATE TABLE events (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    start_date TIMESTAMP,
    end_date TIMESTAMP,
    venue VARCHAR(255) NOT NULL,
    sales_start TIMESTAMP,
    sales_end TIMESTAMP,
    status VARCHAR(50) NOT NULL,
    organizer_id UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- User attending events (many-to-many)
CREATE TABLE user_attending_events (
    user_id UUID NOT NULL REFERENCES users(id),
    event_id UUID NOT NULL REFERENCES events(id),
    PRIMARY KEY (user_id, event_id)
);

-- User staffing events (many-to-many)
CREATE TABLE user_staffing_events (
    user_id UUID NOT NULL REFERENCES users(id),
    event_id UUID NOT NULL REFERENCES events(id),
    PRIMARY KEY (user_id, event_id)
);

-- Ticket types table
CREATE TABLE ticket_types (
    id UUID PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    price DOUBLE PRECISION NOT NULL,
    description VARCHAR(255),
    total_available INTEGER,
    event_id UUID REFERENCES events(id),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Tickets table
CREATE TABLE tickets (
    id UUID PRIMARY KEY,
    status VARCHAR(50) NOT NULL,
    ticket_type_id UUID REFERENCES ticket_types(id),
    purchaser_id UUID REFERENCES users(id),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- QR codes table
CREATE TABLE qr_codes (
    id UUID PRIMARY KEY,
    status VARCHAR(50) NOT NULL,
    value TEXT NOT NULL,
    ticket_id UUID REFERENCES tickets(id),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);

-- Ticket validations table
CREATE TABLE ticket_validations (
    id UUID PRIMARY KEY,
    status VARCHAR(50) NOT NULL,
    validation_method VARCHAR(50) NOT NULL,
    ticket_id UUID REFERENCES tickets(id),
    created_at TIMESTAMP NOT NULL,
    updated_at TIMESTAMP NOT NULL
);
