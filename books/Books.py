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
	parser.add_argument('--year', '-y', nargs='*')
	parser.add_argument('--version', '-v', action='version', version = '%(prog)s 1.0, Chloe Morscheck and Ann Beimers, CS 257, January 15, 2021')

	return parser.parse_args()

def sort_by_author(sorted_list, author):
	#change name (not sorting - filtering?)
	#option 1: remove stuff that doesn't match from sorted_list
	#new_list = []
	#for book in sorted_list:
	#if book matches, append to new_list and return new_list
	for i in range(len(book_list)):
		if author.lower() in book_list[i][2].lower():
			if sorted_list.count(book_list[i]) == 0:
				sorted_list.append(book_list[i])
	return sorted_list

def sort_by_title(sorted_list, title):
	for i in range(len(book_list)):
		if title.lower() in book_list[i][0].lower():
			if sorted_list.count(book_list[i]) == 0:
				sorted_list.append(book_list[i])
	return sorted_list

def sort_by_year(sorted_list, year):
	if year == []:
		year = ['0', '2021']
		# Default case: not ideal to have this hardcoded
	if len(year) == 2:
		for i in range(len(book_list)):
			if book_list[i][1] >= year[0] and book_list[i][1] <= year[1]:
				if sorted_list.count(book_list[i]) == 0:
					sorted_list.append(book_list[i])
	else:
		for i in range(len(book_list)):
			if book_list[i][1] == year[0]:
				if sorted_list.count(book_list[i]) == 0:
					sorted_list.append(book_list[i])
	return sorted_list

def main():
	arguments = get_parsed_arguments()
	author = ' '.join(arguments.author)
	title = ' '.join(arguments.title)
	book_list = []
	with open('books.csv', newline='') as csvfile:
		reader = csv.reader(csvfile)
		for row in reader:
			book_list.append([row[0],row[1],row[2]])

	#filtered_list = book_list

	if author != '':
		filtered_list = filtered_by_author(book_list, author)
	if title != '':
		sorted_list = sort_by_title(sorted_list, title)
	if arguments.year != '0 2021':
		sorted_list = sort_by_year(sorted_list, arguments.year)

	for i in range(len(sorted_list)):
		print(sorted_list[i][0] + ", " + sorted_list[i][1] + ", " + sorted_list[i][2])

if __name__ == '__main__':
	main()
