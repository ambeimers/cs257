'''
Author: Ann Beimers, 28 Jan, 2021

This program does one of five things based on command-line input:
	Prints a version statement
    Prints a usage statement for "python3 olympics.py -h" (or --help). You may use argparse or not for command-line parsing and usage statement printing.
    Lists the names of all the athletes from a specified NOC.
    Lists all the NOCs and the number of gold medals they have won, in decreasing order of the number of gold medals.
	Lists top 5 athletes and how many medals they have won in a given sport.

'''
import psycopg2
import argparse

def get_parsed_arguments():
	"""Analyzes command-line arguments to provide search parameters, and returns a namespace object."""

	parser = argparse.ArgumentParser(description = 'Queries olympics data by given parameters.')
	parser.add_argument('--athletes', '-a', default='', nargs='*')
	parser.add_argument('--medals', '-m', default='', nargs='*')
	parser.add_argument('--sport', '-s', default='', nargs='*')
	parser.add_argument('--version', '-v', action='version', version = '%(prog)s 1.0, Ann Beimers, CS 257, January 28, 2021')

	return parser.parse_args()

def query_athletes(search_string, cursor):
	query = '''SELECT DISTINCT athlete_name FROM medals WHERE noc = %s'''
	try:
	    cursor.execute(query, (search_string,))
	except Exception as e:
	    print(e)
	    exit()

	print('===== Athletes from NOC {0} ====='.format(search_string))
	for row in cursor:
		print(row[0])
	print()

def query_medals(cursor):
	try:
		search_string = 'Gold'
		query = 'SELECT COUNT(medal), noc FROM medals WHERE medal = %s GROUP BY noc ORDER BY COUNT(medal) DESC'
		cursor.execute(query, (search_string,))
		print(cursor.query)
	except Exception as e:
		print(e)
		exit()

	print('===== Medals by NOC (DESC) ====='.format(search_string))
	for row in cursor:
	    print(row[0], row[1])
	print()

def query_sport(search_string, cursor):
	query = 'SELECT athlete_name, COUNT(medal) FROM medals WHERE sport = %s GROUP BY athlete_name ORDER BY COUNT(medal) DESC LIMIT 5'
	try:
		cursor.execute(query, (search_string,))
	except Exception as e:
		print(e)
		exit()

	print('===== Top 5 Athletes by Sport and Number of Medals Won ====='.format(search_string))
	for row in cursor:
	    print(row[0], row[1])
	print()


def main():
	#Connect to Database
	from config import password
	from config import database
	from config import user

	try:
	    connection = psycopg2.connect(database=database, user=user, password=password)
	except Exception as e:
	    print(e)
	    exit()

	#Create cursor
	cursor = connection.cursor()

	#Get arguments from command line
	arguments = get_parsed_arguments()

	#Query Database
	if arguments.athletes:
		noc = ' '.join(arguments.athletes)
		query_athletes(noc, cursor)
	if arguments.medals is not None:
		query_medals(cursor)
	if arguments.sport:
		sport = ' '.join(arguments.sport)
		query_sport(sport, cursor)

	#Close database connection
	connection.close()

if __name__ == '__main__':
	main()
