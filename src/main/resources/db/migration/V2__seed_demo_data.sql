-- Demo organizer user (Keycloak UUID - update this with actual Keycloak user ID after realm setup)
INSERT INTO users (id, name, email, created_at, updated_at) VALUES
    ('00000000-0000-0000-0000-000000000001', 'Demo Organizer', 'organizer@demo.com', NOW(), NOW());

-- Sample published events
INSERT INTO events (id, name, start_date, end_date, venue, sales_start, sales_end, status, organizer_id, created_at, updated_at) VALUES
    ('10000000-0000-0000-0000-000000000001', 'Summer Music Festival 2026', '2026-07-15 18:00:00', '2026-07-15 23:00:00', 'Central Park Amphitheater', '2026-04-01 00:00:00', '2026-07-14 23:59:00', 'PUBLISHED', '00000000-0000-0000-0000-000000000001', NOW(), NOW()),
    ('10000000-0000-0000-0000-000000000002', 'Tech Conference 2026', '2026-09-20 09:00:00', '2026-09-21 17:00:00', 'Convention Center Hall A', '2026-05-01 00:00:00', '2026-09-19 23:59:00', 'PUBLISHED', '00000000-0000-0000-0000-000000000001', NOW(), NOW()),
    ('10000000-0000-0000-0000-000000000003', 'Stand-Up Comedy Night', '2026-06-10 20:00:00', '2026-06-10 22:30:00', 'Downtown Comedy Club', '2026-04-15 00:00:00', '2026-06-10 19:00:00', 'PUBLISHED', '00000000-0000-0000-0000-000000000001', NOW(), NOW()),
    ('10000000-0000-0000-0000-000000000004', 'Art Exhibition Opening', '2026-08-05 16:00:00', '2026-08-05 21:00:00', 'City Art Gallery', '2026-06-01 00:00:00', '2026-08-05 15:00:00', 'PUBLISHED', '00000000-0000-0000-0000-000000000001', NOW(), NOW());

-- Ticket types for each event
INSERT INTO ticket_types (id, name, price, description, total_available, event_id, created_at, updated_at) VALUES
    -- Summer Music Festival
    ('20000000-0000-0000-0000-000000000001', 'General Admission', 49.99, 'Standing area access', 500, '10000000-0000-0000-0000-000000000001', NOW(), NOW()),
    ('20000000-0000-0000-0000-000000000002', 'VIP', 149.99, 'VIP lounge with complimentary drinks', 50, '10000000-0000-0000-0000-000000000001', NOW(), NOW()),
    -- Tech Conference
    ('20000000-0000-0000-0000-000000000003', 'Standard Pass', 199.99, 'Access to all sessions', 300, '10000000-0000-0000-0000-000000000002', NOW(), NOW()),
    ('20000000-0000-0000-0000-000000000004', 'Premium Pass', 399.99, 'All sessions plus workshops and networking dinner', 100, '10000000-0000-0000-0000-000000000002', NOW(), NOW()),
    -- Comedy Night
    ('20000000-0000-0000-0000-000000000005', 'Standard Seat', 25.00, 'Regular seating', 150, '10000000-0000-0000-0000-000000000003', NOW(), NOW()),
    ('20000000-0000-0000-0000-000000000006', 'Front Row', 45.00, 'Front row seating', 20, '10000000-0000-0000-0000-000000000003', NOW(), NOW()),
    -- Art Exhibition
    ('20000000-0000-0000-0000-000000000007', 'Entry', 15.00, 'General entry to the exhibition', 200, '10000000-0000-0000-0000-000000000004', NOW(), NOW());
