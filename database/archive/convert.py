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

def convert_age_to_int(age):
  if age != 'NA':
    age = int(age)
  else:
    age = 'NULL'
  return age

def convert_weight_to_int(weight):
  if weight != 'NA':
    weight = float(weight) // 1
    weight = int(weight)
  else:
    weight = 'NULL'
  return weight  

def convert_height_to_int(height):
  if height != 'NA':
    height = int(height)
  else:
    height = 'NULL'
  return height 

def remove_double_quotes_from_name(name):
  for i in range(len(name)):
    if name[i] == '"':
      name = name[0:i] + '~' + name[i+1:]

def read_and_write_files():

  athletes = open('output_csv_files/athletes.csv', 'w')
  medals = open('output_csv_files/medals.csv', 'w')
  regions = open('output_csv_files/regions.csv', 'w')
  count_of_usa_medals = 0
  usa_medals_array = []
  with open('input_csv_files/athlete_events.csv') as f:
    csv_reader = csv.reader(f)
    row_count = 0
    for row in csv_reader:
      if row_count == 0:
        row_count += 1
        continue
      athlete_id = row[0]
      athlete_name = row[1]
      athlete_name = remove_commas(athlete_name)
      athlete_name = remove_double_quotes_from_name(athlete_name)
      sex = row[2]
      age = convert_age_to_int(row[3])
      height = convert_height_to_int(row[4])
      weight = convert_weight_to_int(row[5])
      team = row[6]
      team = remove_commas(team)
      noc = row[7]
      game = row[8]
      game = remove_commas(game)
      year = row[9]
      season = row[10]
      city = row[11]
      city = remove_commas(city)
      sport = row[12]
      event = row[13]
      event = remove_commas(event)
      medal = row[14]
      print(f"{row_count},{athlete_name},{sex},{age},{height},{weight},{team}", file=athletes)
      if medal != 'NA':
        print(f"{row_count},{athlete_name},{noc},{medal},{event},{sport},{game},{year},{season},{city}", file=medals)
      row_count += 1
  with open('input_csv_files/noc_regions.csv') as f:
    csv_reader = csv.reader(f)
    row_number = 1
    for row in csv_reader:
      noc = row[0]
      region = row[1]
      region = remove_commas(region)
      notes = row[2]
      print(f"{row_number},{noc},{region},{notes}", file=regions)
      row_number += 1


def main():
  read_and_write_files()

if __name__ == '__main__':
	main()
