'''
    Ann Beimers and Matthew Smith-Erb
    Converts the dataset from Kaggle into a smaller one to be converted into a postgresql DB
'''

import csv
import sys

csv_folder = 'archive/'


def main():
    try:
        artists_file = open(csv_folder + "data_by_artist.csv", newline='')
        songs_file = open(csv_folder + "data.csv", newline='')
    except:
        print("Invalid Filepath", file=sys.stderr)
        sys.exit()


    artist_id = {}

    #arrays that will be dumped into csvs with generate_csv()
    artists_data = []
    songs_data = []
    songs_artists_data = []

    artists_reader = csv.reader(artists_file)
    songs_reader = csv.reader(songs_file)

    #parse artists
    next(artists_reader)
    for row in artists_reader:
        id = len(artists_data) + 1
        artist_name = row[0]
        acousticness = row[1]
        danceability = row[2]
        duration = row[3]
        energy = row[4]
        loudness = row[7]
        speechiness = row[8]
        tempo = row[9]
        valence = row[10]
        popularity = row[11]
        artist_id[artist_name] = id

        artists_data.append([id, artist_name, acousticness, danceability, duration, energy, loudness, speechiness, tempo, valence, popularity])

    #parse songs and make songs_artists_data simultaneously
    next(songs_reader)
    for row in songs_reader:
        id = len(songs_data) + 1
        spotify_id = row[6]
        song_name = row[12]
        acousticness = row[0]
        danceability = row[2]
        duration = row[3]
        energy = row[4]
        loudness = row[10]
        speechiness = row[15]
        tempo = row[16]
        valence = row[17]
        popularity = row[13]
        year = row[18]

        songs_data.append([id, spotify_id, song_name, acousticness, danceability, duration, energy, loudness, speechiness, tempo, valence, popularity, year])

        artists = eval(row[1])
        for artist in artists:
            if artist in artist_id:
                songs_artists_data.append([id, artist_id[artist]])

    generate_csv(artists_data, "artists")
    generate_csv(songs_data, "songs")
    generate_csv(songs_artists_data, "songs_artists")


def generate_csv(data, file_name):
    '''generates a csv called file_name from the data list'''
    file_to_create = file_name + ".csv"
    with open(file_to_create, 'w', newline='') as file:
        writer = csv.writer(file)
        for entry in data:
            writer.writerow(entry)

if __name__ == '__main__':
    main()
