'''
    Ann Beimers and Matthew Smith-Erb
    Flask API
'''
import sys
import flask
import json
import config
import psycopg2

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
    year_dict["year"] = year_data[0]
    year_dict["acousticness"] = year_data[1]
    year_dict["danceability"] = year_data[2]
    year_dict["duration"] = year_data[3]
    year_dict["energy"] = year_data[4]
    year_dict["loudness"] = year_data[5]
    year_dict["speechiness"] = year_data[6]
    year_dict["tempo"] = year_data[7]
    year_dict["valence"] = year_data[8]
    year_dict["popularity"] = year_data[9]
    return json.dumps(year_dict)

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
