AUTHORS: Ann Beimers, Matthew Smith-Erb

INSTALLATION: After running data.sql, while connected to the database as a superuser, you must run "CREATE EXTENSION fuzzystrmatch;" to add
a built-in postgreSQL extension.

DATA: Spotify music data for songs, years, and artists, with nine attributes describing their characteristics (eg danceability, tempo, etc).

FEATURES CURRENTLY WORKING:
- year comparator
- artist comparator
- navigation bar

FEATURES NOT YET WORKING:
- song comparator
- new music generator
    - api endpoint
- artist/year Lookup
- home page
