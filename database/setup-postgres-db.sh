#!/bin/bash

psql -c "CREATE USER rsvp WITH SUPERUSER PASSWORD '2014';"
createdb rsvp -O rsvp
