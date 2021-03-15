AUTHORS: Ann Beimers, Matthew Smith-Erb

INSTALLATION: After running data.sql, while connected to the database as a superuser, you must run "CREATE EXTENSION fuzzystrmatch;" to add
a built-in postgreSQL extension.

DATA: Spotify music data for songs, years, and artists, with nine attributes describing their characteristics (eg danceability, tempo, etc).

Copyright: Community Data License Agreement – Sharing – Version 1.0

Data available for download here: https://www.kaggle.com/yamaerenay/spotify-dataset-19212020-160k-tracks?select=data_w_genres.csv

STATUS: Everything is working.

NOTES: Reminder to run "CREATE EXTENSION fuzzystrmatch;" in the postgres database in order to use the webapp.
