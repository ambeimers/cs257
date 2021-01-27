'''
  Query design by Ann Beimers and Quoc Nguyen, January 26th, 2021.
'''

SELECT noc FROM regions ORDER BY noc;

SELECT name FROM athletes WHERE team = 'Kenya';

SELECT * FROM medals WHERE athlete_name LIKE '%Greg Louganis%' ORDER BY year ASC;

SELECT COUNT(medal), noc FROM medals WHERE medal = 'Gold' GROUP BY noc ORDER BY COUNT(medal) DESC;
