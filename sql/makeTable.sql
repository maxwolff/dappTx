CREATE TABLE transactions(blob jsonb);
CREATE INDEX ON transactions((blob->>'to'));
CREATE INDEX ON transactions((blob->>'timestamp'));
