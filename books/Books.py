# Chloe Morscheck and Ann Beimers, CS 257
# Books.py

import argparse
import csv

book_list = []

def get_parsed_arguments():
	parser = argparse.ArgumentParser(description = 'Sorts books by provided parameters.')

	#file name
	parser.add_argument('file')

	# --author or -a
	parser.add_argument('--author', '-a', default='', nargs='*')

	# --title or -t
	parser.add_argument('--title', '-t', default='', nargs='*')

	# --year or -y
	parser.add_argument('--year', '-y', default=['0', '2021'], nargs='*')

	# --version or -v
	parser.add_argument('--version', '-v')

	return parser.parse_args()


def sort_by_author(sorted_list, author):
	for i in range(len(book_list)-1):
		if author.lower() in book_list[i][2].lower():
			sorted_list.append(book_list[i])
	return sorted_list

def sort_by_title(sorted_list, title):
	for i in range(len(book_list)-1):
		if title.lower() in book_list[i][0].lower():
			sorted_list.append(book_list[i])
	return sorted_list

def sort_by_year(sorted_list, year):
	if len(year) == 2:
		for i in range(len(book_list)-1):
			if book_list[i][1] >= year[0] and book_list[i][1] <= year[1]:
				sorted_list.append(book_list[i])
	else:
		for i in range(len(book_list)-1):
			if book_list[i][1] == year[0]:
				sorted_list.append(book_list[i])
	return sorted_list

def main():
	arguments = get_parsed_arguments()
	author = ' '.join(arguments.author)
	title = ' '.join(arguments.title)
	sorted_list = []
	with open('books.csv', newline='') as csvfile:
		reader = csv.reader(csvfile)
		for row in reader:
			book_list.append([row[0],row[1],row[2]])

	if author != '':
		sorted_list = sort_by_author(sorted_list, author)
	if title != '':
		sorted_list = sort_by_title(sorted_list, title)
	if arguments.year != '0 2021':
		sorted_list = sort_by_year(sorted_list, arguments.year)


	for i in range(len(sorted_list)):
		print(sorted_list[i][0] + ", " + sorted_list[i][1] + ", " + sorted_list[i][2])

if __name__ == '__main__':
	main()
