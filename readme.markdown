# Natalie and Rob

This is our website to celebrate the upcoming wedding.

## Open Source Usage

The following is a list of open-source components used:

* [Harp](http://harpjs.com/)
* [Node.js](http://nodejs.org/)
* [LESS](http://lesscss.org/)
* [Gridism](http://cobyism.com/gridism/)
* [Eric Meyer's Reset CSS v2.0](http://meyerweb.com/eric/tools/css/reset/)

## Symbolset

This site is using a [Symbolset](http://symbolset.com/) font set.

The Symbolset files are not included in this repository.

# Usage

Install dependencies first for npm:

    $ npm install

To start the development server (both the client and the API servers):

    $ npm run server
    
You can also run the development server in "reload" mode using [forever](https://github.com/nodejitsu/forever) and [Harp](http://harpjs.com/):

    $ npm run server-reload
    
Now you do not need to restart the node.js server or rebuild the client if you make any changes.

To build the static client code for deployment:

    $ npm run build

# Disclaimer

Red and Black Heart SVG image is copyright [Stephanie Sharp](https://www.etsy.com/people/SincerelySweets/).

All images are copyright of Rob Shaw.

Source code is MIT licensed with no added caveats. See LICENSE file for more details.
