--Ann Beimers and Matthew Smith-Erb
CREATE TABLE songs_artists(
    song_id integer,
    artist_id integer
)

CREATE TABLE songs(
    id integer,
    spotify_id text,
    song_name text,
    artist_name text,
    acousticness float,
	danceability float,
	duration integer,
	energy float,
	speechiness float,
	loudness float,
	tempo float,
	popularity integer,
	valence float,
    year integer
)

CREATE TABLE artists(
    id integer,
    spotify_id text,
    artist_name text,
    acousticness float,
	danceability float,
	duration integer,
	energy float,
	speechiness float,
	loudness float,
	tempo float,
	popularity integer,
	valence float
)

CREATE TABLE years(
    year integer,
    acousticness float,
	danceability float,
	duration integer,
	energy float,
	speechiness float,
	loudness float,
	tempo float,
	popularity integer,
	valence float
)
