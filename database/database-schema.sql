
olympics=> CREATE TABLE athletes(
olympics(> id SERIAL,
olympics(> name text,
olympics(> sex text,
olympics(> team text);

olympics=> CREATE TABLE games(
olympics(> id SERIAL,
olympics(> game_name text,
olympics(> year text,
olympics(> season text,
olympics(> city text);

olympics=> CREATE TABLE events(
id SERIAL,
event_name text,
sport text);

olympics=> CREATE TABLE region(
id SERIAL,
noc text,
region_name text, notes text);

olympics=> CREATE TABLE athlete_events(
olympics(> athlete_id integer,
olympics(> events_id integer);
