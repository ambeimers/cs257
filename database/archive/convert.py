'''
Authors: Ann Beimers and Quoc
'''

import csv

athletes = open('athletes.csv', 'w')
regions = open('regions.csv', 'w')
games = open('games.csv', 'w')
events = open('events.csv', 'w')

with open('athlete_events.csv') as f:
  csv_reader = csv.reader(f)
  athlete_id = -1
  for row in csv_reader:
    if row[0] == athlete_id:
      continue
    try:      
      athlete_id = row[0]
      name = row[1]
      sex = row[2]
      age = int(row[3])
      height_centimeters = int(row[4])
      weight_kilos = int(row[5])
      team = row[6]
      noc = row[7]
      game = row[8]
      year = row[9]
      season = row[10]
      city = row[11]
      sport = row[12]
      event = row[13]
      medal = row[14]
      print(f"{athlete_id}, {name}, {sex}, {team}", file=athletes)
      print(f"{game}, {year}, {season}, {city}", file=games)
      print(f"{event}, {sport}", file=events)      
    except ValueError:
      continue
     

with open('noc_regions.csv') as f:
  csv_reader = csv.reader(f)
  for row in csv_reader:
    noc = row[0]
    region = row[1]
    notes = row[2]
    print(f"{noc}, {region}, {notes}", file=regions)
