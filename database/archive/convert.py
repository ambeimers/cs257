'''
Authors: Ann Beimers and Quoc
'''

import csv


def remove_commas(input_string):
  for i in range(len(input_string)):
    if i > len(input_string)-1:
      break
    if input_string[i] == ',':
      input_string = input_string[0:i] + input_string[i+1:]
  return input_string

athletes = open('athletes.csv', 'w')
regions = open('regions.csv', 'w')
games = open('games.csv', 'w')
events = open('events.csv', 'w')

with open('athlete_events.csv') as f:
  csv_reader = csv.reader(f)
  athlete_id = -1
  row_count = 1
  for row in csv_reader:
    if row[0] == athlete_id:
      continue
    try:
      athlete_id = row[0]
      name = row[1]
      name = remove_commas(name)
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
      event = remove_commas(event)
      medal = row[14]
      print(f"{row_count},{name},{sex},{team},{medal}", file=athletes)
      print(f"{row_count},{game},{year},{season},{city}", file=games)
      print(f"{row_count},{event},{sport}", file=events)
      row_count += 1
    except ValueError:
      continue


with open('noc_regions.csv') as f:
  csv_reader = csv.reader(f)
  row_number = 1
  for row in csv_reader:
    noc = row[0]
    region = row[1]
    region = remove_commas(region)
    notes = row[2]
    print(f"{row_number},{noc},{region},{notes},{medal}", file=regions)
    row_number += 1

