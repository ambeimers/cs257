'''
  Database design by Ann and Quoc.
'''

CREATE TABLE athletes(
id SERIAL,
name text,
sex text,
age integer,
height integer,
weight integer,
team text);

CREATE TABLE regions(
id SERIAL,
noc text,
region_name text,
notes text);

CREATE TABLE medals(
id SERIAL,
athlete_name text,
noc text,
medal text,
event text,
sport text,
game text,
year text,
season text,
city text);
