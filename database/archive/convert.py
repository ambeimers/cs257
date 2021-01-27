'''
Authors: Ann Beimers and Quoc Nguyen
Date: January 26th, 2021

This program converts 2 .csv files into 3 smaller .csv files.

'''

import csv

def remove_commas(input_string):
  for i in range(len(input_string)):
    if i > len(input_string)-1:
      break
    if input_string[i] == ',':
      input_string = input_string[0:i] + input_string[i+1:]
  return input_string

def read_files():
  athletes = open('athletes.csv', 'w')
  medals = open('medals.csv', 'w')
  regions = open('regions.csv', 'w')
  with open('athlete_events.csv') as f:
    csv_reader = csv.reader(f)
    row_count = 1
    for row in csv_reader:
      try:
        athlete_id = row[0]
        athlete_name = row[1]
        athlete_name = remove_commas(athlete_name)
        sex = row[2]
        age = int(row[3])
        height = int(row[4])
        weight = int(row[5])
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
        print(f"{row_count},{athlete_name},{sex},{age},{height},{weight},{team}", file=athletes)
        if medal != 'NA':
          print(f"{row_count},{athlete_name},{noc},{medal},{event},{sport},{game},{year},{season},{city}", file=medals)
        row_count += 1
      except ValueError:
        continue
  with open('noc_regions.csv') as f:
    csv_reader = csv.reader(f)
    row_count = 1
    for row in csv_reader:
      noc = row[0]
      region = row[1]
      region = remove_commas(region)
      notes = row[2]
      print(f"{row_count},{noc},{region},{notes}", file=regions)
      row_number += 1

def main():
  read_files()

if __name__ == '__main__':
	main()
