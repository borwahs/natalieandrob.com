# Natalie and Rob

This is our website to celebrate the upcoming wedding.

## Open Source Usage

The following is a list of open-source components used:

* [Harp](http://harpjs.com/)
* [Node.js](http://nodejs.org/)
* [LESS](http://lesscss.org/)
* [Gridism](http://cobyism.com/gridism/)
* [Eric Meyer's Reset CSS v2.0](http://meyerweb.com/eric/tools/css/reset/)

## Icon Melon

This site is using SVG icons from [iconmelon](http://iconmelon.com/).

# Database Setup

Run the database script in your Postgres instance:

    $ psql -d {database} -f database/subscribers_schema.sql
    $ psql -d {database} -f database/login_user_schema.sql
    $ psql -d {database} -f database/rsvp-system-schema.sql
    
Replace `{database}` with the name of your database in postgres.

# Usage

Install dependencies first for npm:

    $ npm install

To start the development server (both the client and the API servers):

    $ npm run development-server
    
This will "live reload" both the client and the server code so you don't ever have to stop and start anything.

To start the production server:

    $ npm run production-server
    
This will build the client side code and start the API server with forever.

# Disclaimer

Red and Black Heart SVG image along with Red Heart icon is copyright and attributed to [Stephanie Sharp](https://www.etsy.com/people/SincerelySweets/).

All other images are copyright of Rob Shaw.

Source code is MIT licensed with no added caveats. See LICENSE file for more details.
