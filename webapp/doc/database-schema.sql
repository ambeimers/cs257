--Ann Beimers and Matthew Smith-Erb
CREATE TABLE songs_artists(
    song_id integer,
    artist_id integer
);

CREATE TABLE songs(
    id integer,
    spotify_id text,
    song_name text,
		acousticness float,
		danceability float,
		duration float,
		energy float,
		loudness float,
		speechiness float,
		tempo float,
		valence float,
		popularity float,
		year float
);

CREATE TABLE artists(
    id integer,
    artist_name text,
		acousticness float,
		danceability float,
		duration float,
		energy float,
		loudness float,
		speechiness float,
		tempo float,
		valence float,
		popularity float
);

CREATE TABLE years(
  year integer,
  acousticness float,
	danceability float,
	duration float,
	energy float,
	loudness float,
	speechiness float,
	tempo float,
	valence float,
	popularity float
);
