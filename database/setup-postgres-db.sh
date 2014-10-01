#!/bin/bash

psql -c "CREATE USER rsvp WITH SUPERUSER PASSWORD '2014';"
createdb rsvp -O rsvp


psql -d rsvp -f './login_user_schema.sql'
psql -d rsvp -f './subscribers_schema.sql'
psql -d rsvp -f './rsvp-schema.sql'

