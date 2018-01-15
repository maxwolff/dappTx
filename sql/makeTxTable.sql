CREATE TABLE transactions(blob jsonb);
CREATE INDEX ON transactions((blob->>'to'));
