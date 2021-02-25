'''
    Ann Beimers and Matthew Smith-Erb
'''
import sys
import flask
import json
import config
import psycopg2

#sensitive infromation about the database to access
from config import password
from config import database
from config import user

api = flask.Blueprint('api', __name__)

@api.route('/year/<year>')
def get_year(year):
    parameter = (str(year),)
    query = '''
    SELECT year, acousticness, danceability, duration, energy, loudness, speechiness, tempo, valence, popularity
    FROM years
    WHERE
    year = %s
    '''
    connection = get_connection(database, user, password)
    year_data = get_query(query, parameter, connection)
    year_dict = {}
    year_dict["year"] = year_data[0][0]
    year_dict["acousticness"] = year_data[0][1]
    year_dict["danceability"] = year_data[0][2]
    year_dict["duration"] = year_data[0][3]
    year_dict["energy"] = year_data[0][4]
    year_dict["loudness"] = year_data[0][5]
    year_dict["speechiness"] = year_data[0][6]
    year_dict["tempo"] = year_data[0][7]
    year_dict["valence"] = year_data[0][8]
    year_dict["popularity"] = int(year_data[0][9])

    return json.dumps(year_dict)

@api.route('/artist/<artist_id>')
def get_artist(artist_id):
    parameter = (str(artist_id),)
    query = '''
    SELECT artist_name, acousticness, danceability, duration, energy, loudness, speechiness, tempo, valence, popularity
    FROM artists
    WHERE
    id = %s
    '''
    connection = get_connection(database, user, password)
    artist_data = get_query(query, parameter, connection)
    artist_dict = {}
    artist_dict["artist_name"] = artist_data[0][0]
    artist_dict["acousticness"] = artist_data[0][1]
    artist_dict["danceability"] = artist_data[0][2]
    artist_dict["duration"] = artist_data[0][3]
    artist_dict["energy"] = artist_data[0][4]
    artist_dict["loudness"] = artist_data[0][5]
    artist_dict["speechiness"] = artist_data[0][6]
    artist_dict["tempo"] = artist_data[0][7]
    artist_dict["valence"] = artist_data[0][8]
    artist_dict["popularity"] = int(artist_data[0][9])

    return json.dumps(artist_dict)

@api.route('/song/<song_id>')
def get_song(song_id):
    parameter = (str(song_id),)
    query = '''
    SELECT song_name, acousticness, danceability, duration, energy, loudness, speechiness, tempo, valence, popularity, year
    FROM songs
    WHERE
    id = %s
    '''
    connection = get_connection(database, user, password)
    song_data = get_query(query, parameter, connection)
    song_dict = {}
    song_dict["song_name"] = song_data[0][0]
    song_dict["acousticness"] = song_data[0][1]
    song_dict["danceability"] = song_data[0][2]
    song_dict["duration"] = song_data[0][3]
    song_dict["energy"] = song_data[0][4]
    song_dict["loudness"] = song_data[0][5]
    song_dict["speechiness"] = song_data[0][6]
    song_dict["tempo"] = song_data[0][7]
    song_dict["valence"] = song_data[0][8]
    song_dict["popularity"] = int(song_data[0][9])
    song_dict["year"] = int(song_data[0][10])

    return json.dumps(song_dict)

@api.route('/song/artist/<artist_id>/<attribute_name>')
def get_song_artist_attribute(artist_id, attribute_name):
    #stop sql injection, since this has to be passed in through string interpolation
    potential_attributes = ['acousticnes', 'danceability', 'duration', 'energy', 'loudness', 'speechiness', 'tempo', 'valence', 'popularity', 'year']
    if attribute_name not in potential_attributes:
        flask.abort(400)

    #default to the song with the most of the attribute, and stop sql injection
    sort_by = flask.request.args.get('sort_by')
    order = 'DESC'
    if sort_by == 'least':
        order = 'ASC'

    parameter = (str(artist_id),)
    query = '''
    SELECT songs.id, songs.spotify_id, songs.song_name
    FROM songs, artists, songs_artists
    WHERE
    artists.id = %s
    AND artists.id = songs_artists.artist_id
    AND songs.id = songs_artists.song_id
    ORDER BY songs.''' + attribute_name + ''' ''' + order + '''
    LIMIT 1
    '''

    connection = get_connection(database, user, password)
    song_data = get_query(query, parameter, connection)
    song_dict = {}
    song_dict["song_id"] = song_data[0][0]
    song_dict["spotify_id"] = song_data[0][1]
    song_dict["song_name"] = song_data[0][2]

    return json.dumps(song_dict)

@api.route('/song/year/<year>/<attribute_name>')
def get_song_year_attribute(year, attribute_name):
    #stop sql injection, since this has to be passed in through string interpolation
    potential_attributes = ['acousticnes', 'danceability', 'duration', 'energy', 'loudness', 'speechiness', 'tempo', 'valence', 'popularity', 'year']
    if attribute_name not in potential_attributes:
        flask.abort(400)

    #default to the song with the most of the attribute, and stop sql injection
    sort_by = flask.request.args.get('sort_by')
    order = 'DESC'
    if sort_by == 'least':
        order = 'ASC'

    parameter = (str(year),)
    query = '''
    SELECT songs.id, songs.spotify_id, songs.song_name
    FROM songs
    WHERE
    songs.year = %s
    ORDER BY songs.''' + attribute_name + ''' ''' + order + '''
    LIMIT 1
    '''

    connection = get_connection(database, user, password)
    song_data = get_query(query, parameter, connection)
    song_dict = {}
    song_dict["song_id"] = song_data[0][0]
    song_dict["spotify_id"] = song_data[0][1]
    song_dict["song_name"] = song_data[0][2]

    return json.dumps(song_dict)

def get_connection(database, user, password):
    '''Establishes and returns the connection with the postgres database'''
    try:
        connection = psycopg2.connect(database=database, user=user, password=password)
    except Exception as e:
        print(e)
        exit()

    return connection

def get_query(query, parameter, connection):
    '''Returns the contents from a query with a parameter to the specified connection as a list'''
    cursor = connection.cursor()
    try:
        if parameter == ():
            cursor.execute(query)
        else:
            cursor.execute(query, parameter)
    except Exception as e:
        print(e)
        exit()

    data = []
    for row in cursor:
        data.append(row)
    return data
