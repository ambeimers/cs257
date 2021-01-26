'''
Authors: Ann Beimers and Quoc
'''

import csv

athletes = open('athletes.csv', 'w')

with open('athlete_events.csv') as f:
  csv_reader = csv.reader(f)
  for row in csv_reader:
    try:
      athlete_id = row[0]
      name = row[1]
      sex = row[2]
      age = int(row[3])
      height_centimeters = int(row[3])
      weight_kilos = int(row[4])
      team = row[5]
      noc = row[6]
      games = row[7]
      year = row[8]
      season = row[9]
      city = row[10]
      sport = row[11]
      event = row[12]
      medal = row[13]
      print(name, file=athletes)
    except ValueError:
      continue
