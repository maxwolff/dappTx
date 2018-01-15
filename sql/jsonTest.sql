CREATE TABLE json_test (
  id serial primary key,
  data jsonb
);

INSERT INTO json_test (data) VALUES 
  ('{}'),
  ('{"a": 1}'),
  ('{"a": 2, "b": ["c", "d"]}'),
  ('{"a": 1, "b": {"c": "d", "e": true}}'),
  ('{"b": 2}');
  