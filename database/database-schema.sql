
CREATE TABLE athletes(
id SERIAL,
name text,
sex text,
team text);

 CREATE TABLE games(
 id SERIAL,
game_name text,
year text,
season text,
city text);

 CREATE TABLE events(
id SERIAL,
event_name text,
sport text);

 CREATE TABLE region(
id SERIAL,
noc text,
region_name text,
notes text);

 CREATE TABLE athlete_events(
 athlete_id integer,
 events_id integer);
