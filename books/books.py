"""Chloe Morscheck and Ann Beimers, CS 257 : books.py
January 22, 2021
This program sorts a file by parameters from the command-line."""

import argparse
import csv

def get_parsed_arguments():
	"""Analyzes command-line arguments to provide search parameters, and returns a namespace object."""

	parser = argparse.ArgumentParser(description = 'Sorts books by provided parameters.')
	parser.add_argument('file')
	parser.add_argument('--author', '-a', default='', nargs='*')
	parser.add_argument('--title', '-t', default='', nargs='*')
	parser.add_argument('--start_year', '-sy', default=['0'], nargs='*')
	parser.add_argument('--end_year', '-ey', default=['2021'], nargs='*')
	parser.add_argument('--version', '-v', action='version', version = '%(prog)s 1.0, Chloe Morscheck and Ann Beimers, CS 257, January 22, 2021')

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

def filter_by_year(filter_from_list, start_year, end_year):
	new_list = []
	year_index = 1
	if start_year == []:
		print("hey")
		start_year = ['0']
	if end_year == []:
		print("hey")
		end_year = ['2021']

	for i in range(len(filter_from_list)):
		if filter_from_list[i][year_index] >= start_year[0] and filter_from_list[i][year_index] <= end_year[0]:
			if new_list.count(filter_from_list[i]) == 0:
				new_list.append(filter_from_list[i])
	'''else:
		for i in range(len(filter_from_list)):
			if filter_from_list[i][year_index] == year[0]:
				if new_list.count(filter_from_list[i]) == 0:
					new_list.append(filter_from_list[i])'''
	return new_list

def print_list(list_to_print):
	for i in range(len(list_to_print)):
		print(list_to_print[i][0] + ", " + list_to_print[i][1] + ", " + list_to_print[i][2])


def main():
	arguments = get_parsed_arguments()

	#joins arguments into single string
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
	if arguments.start_year != '0' or arguments.end_year != '2021':
		print(arguments.start_year, arguments.end_year)
		filter_to_list = filter_by_year(filter_to_list, arguments.start_year, arguments.end_year)

	print_list(filter_to_list)

if __name__ == '__main__':
	main()
