# Chloe Morscheck and Ann Beimers, CS 257
# books.py
# This program sorts a file by parameters from the command-line.

import argparse
import csv


def get_parsed_arguments():
#Analyzes command-line arguments to provide search parameters, and returns a namespace object.

	parser = argparse.ArgumentParser(description = 'Sorts books by provided parameters.')

	parser.add_argument('file')
	parser.add_argument('--author', '-a', default='', nargs='*')
	parser.add_argument('--title', '-t', default='', nargs='*')
	parser.add_argument('--year', '-y', default='0 2021', nargs='*')
	parser.add_argument('--version', '-v', action='version', version = '%(prog)s 1.0, Chloe Morscheck and Ann Beimers, CS 257, January 15, 2021')

	return parser.parse_args()

def filter_by_author(filtered_list, author):
	new_list = []
	for i in range(len(filtered_list)):
		if author.lower() in filtered_list[i][2].lower():
			if new_list.count(filtered_list[i]) == 0:
				new_list.append(filtered_list[i])
	return new_list

def filter_by_title(filtered_list, title):
	new_list = []
	for i in range(len(filtered_list)):
		if title.lower() in filtered_list[i][0].lower():
			if new_list.count(filtered_list[i]) == 0:
				new_list.append(filtered_list[i])
	return new_list

def filter_by_year(filtered_list, year):
	new_list = []
	if year == []:
		year = ['0', '2021']
	if len(year) == 2:
		for i in range(len(filtered_list)):
			if filtered_list[i][1] >= year[0] and filtered_list[i][1] <= year[1]:
				if new_list.count(filtered_list[i]) == 0:
					new_list.append(filtered_list[i])
	else:
		for i in range(len(filtered_list)):
			if filtered_list[i][1] == year[0]:
				if new_list.count(filtered_list[i]) == 0:
					new_list.append(filtered_list[i])
	return new_list

def main():
	arguments = get_parsed_arguments()
	author = ' '.join(arguments.author)
	title = ' '.join(arguments.title)
	book_list = []
	with open('books.csv', newline='') as csvfile:
		reader = csv.reader(csvfile)
		for row in reader:
			book_list.append([row[0],row[1],row[2]])

	filtered_list = book_list

	if author != '':
		filtered_list = filter_by_author(filtered_list, author)
	if title != '':
		filtered_list = filter_by_title(filtered_list, title)
	if arguments.year != '0 2021':
		filtered_list = filter_by_year(filtered_list, arguments.year)

	for i in range(len(filtered_list)):
		print(filtered_list[i][0] + ", " + filtered_list[i][1] + ", " + filtered_list[i][2])

if __name__ == '__main__':
	main()
