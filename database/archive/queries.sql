SELECT noc FROM regions ORDER BY noc;

SELECT DISTINCT name FROM athletes WHERE team='Kenya';
 
SELECT * FROM medals WHERE athlete_name LIKE '%Louganis%' ORDER BY year ASC;

SELECT COUNT(medal), noc FROM medals WHERE medal = 'Gold' GROUP BY noc ORDER BY COUNT(medal) DESC;
