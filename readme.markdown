# Natalie and Rob

This is our website to celebrate the upcoming wedding.

## Open Source Usage

The following is a list of open-source components used:

* [Harp](http://harpjs.com/)
* [Node.js](http://nodejs.org/)
* [LESS](http://lesscss.org/)
* [Gridism](http://cobyism.com/gridism/)
* [Eric Meyer's Reset CSS v2.0](http://meyerweb.com/eric/tools/css/reset/)
* [jQuery](http://jquery.com/)
* [underscore.js](http://underscorejs.org/)
* [Ember](http://emberjs.com/)

## Icon Melon

This site is using SVG icons from [iconmelon](http://iconmelon.com/).

# Database Setup

First, download Postgres and get it running. Then run the following shell script:

   $ ./database/setup-postgres-db.sh

Insert sample data (or data that matches the sample data found under database/ folder). It accepts a filepath as the first parameter. Otherwise, it defaults to the sample data.

    $ node utils/insert-rsvp-data.js


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
