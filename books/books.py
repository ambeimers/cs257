"""Chloe Morscheck and Ann Beimers, CS 257 : books.py
This program sorts a file by parameters from the command-line."""

import argparse
import csv

"""Analyzes command-line arguments to provide search parameters, and returns a namespace object."""
def get_parsed_arguments():
	parser = argparse.ArgumentParser(description = 'Sorts books by provided parameters.')
	parser.add_argument('file')
	parser.add_argument('--author', '-a', default='', nargs='*')
	parser.add_argument('--title', '-t', default='', nargs='*')
	parser.add_argument('--year', '-y', default='0 2021', nargs='*')
	parser.add_argument('--version', '-v', action='version', version = '%(prog)s 1.0, Chloe Morscheck and Ann Beimers, CS 257, January 15, 2021')

	return parser.parse_args()

def filter_by_author(filter_from_list, author):
	new_list = []
	author_index = 2
	for i in range(len(filter_from_list)):
		if author.lower() in filter_from_list[i][author_index].lower():
			if new_list.count(filter_from_list[i]) == 0:
				new_list.append(filter_from_list[i])
	return new_list

def filter_by_title(filter_from_list, title):
	new_list = []
	title_index = 0
	for i in range(len(filter_from_list)):
		if title.lower() in filter_from_list[i][title_index].lower():
			if new_list.count(filter_from_list[i]) == 0:
				new_list.append(filter_from_list[i])
	return new_list

def filter_by_year(filter_from_list, year):
	new_list = []
	year_index = 1
	if year == []:
		year = ['0', '2021']
	if len(year) == 2:
		for i in range(len(filter_from_list)):
			if filter_from_list[i][year_index] >= year[0] and filter_from_list[i][year_index] <= year[1]:
				if new_list.count(filter_from_list[i]) == 0:
					new_list.append(filter_from_list[i])
	else:
		for i in range(len(filter_from_list)):
			if filter_from_list[i][year_index] == year[0]:
				if new_list.count(filter_from_list[i]) == 0:
					new_list.append(filter_from_list[i])
	return new_list

def print_list(plist):
	for i in range(len(plist)):
		print(plist[i][0] + ", " + plist[i][1] + ", " + plist[i][2])
		
		
def main():
	arguments = get_parsed_arguments()
	author = ' '.join(arguments.author)
	title = ' '.join(arguments.title)
	book_list = []
	with open('books.csv', newline='') as csvfile:
		reader = csv.reader(csvfile)
		for row in reader:
			book_list.append([row[0],row[1],row[2]])

	filter_to_list = book_list.copy()

	if author != '':
		filter_to_list = filter_by_author(filter_to_list, author)
	if title != '':
		filter_to_list = filter_by_title(filter_to_list, title)
	if arguments.year != '0 2021':
		filter_to_list = filter_by_year(filter_to_list, arguments.year)

	print_list(filter_to_list)

if __name__ == '__main__':
	main()
