# Chloe Morscheck and Ann Beimers, CS 257
# Books.py

import argparse
import csv

def get_parsed_arguments():
	parser = argparse.ArgumentParser(description = 'Sorts books by provided parameters.', )
	
	parser.add_argument('file', required=True)

	# --author or -a
	parser.add_argument('--author', '-a', default='')

	# --title or -t
	parser.add_argument('--title', '-t', default='')

	# --year or -y
	parser.add_argument('--year', '-y', default='0 2021')

	# --help -h
	parser.add_argument('--help', '-h')

	# --version or -v
	parser.add_argument('--version', '-v')

	return parser.parse_args()


def sort_by_author():
	for i in range(book_list.len()-1):
		if book_list[i][2].contains(author):
			sorted_list.append(booklist[i])
	return sorted_list

def sort_by_title():
	for i in range(book_list.len()-1):
		if book_list[i][0].contains(title):
			sorted_list.append(booklist[i])
	return sorted_list
	

def sort_by_year():
	years = year.split()
	if years.len() == 2:
		for i in range(book_list.len()-1):
			if book_list[i][1] >= year[0] && book_list[i][1] <= year[1]:
				sorted_list.append(booklist[i])
	else:
		for i in range(book_list.len()-1):
			if book_list[i][1] == year[0]:
				sorted_list.append(booklist[i])
	return sorted_list
	
def main():
	get_parsed_arguments();
	book_list = []
	sorted_list = []
	with open(file, newline='') as csvfile:
		reader = csv.DictReader(csvfile)
		for row in reader:
			book_list.append([row[0],row[1],row[2]])
	
	
	
	