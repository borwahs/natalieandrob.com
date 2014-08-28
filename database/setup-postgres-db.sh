#!/bin/bash

psql -c "CREATE USER rob WITH SUPERUSER PASSWORD 'rob';"
createdb rob -O rob
