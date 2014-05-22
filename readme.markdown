# Natalie and Rob

This is our website to celebrate the upcoming wedding.

## Open Source Usage

The following is a list of open-source components used:

* [Middleman](https://github.com/middleman/middleman)
* [Gridism](http://cobyism.com/gridism/)
* [Eric Meyer's Reset CSS v2.0](http://meyerweb.com/eric/tools/css/reset/)
* [Floatlabels](http://clubdesign.github.io/floatlabels.js/)

## Symbolset

This site is using a [Symbolset](http://symbolset.com/) font set.

The Symbolset files are not included in this repository.

# Usage

Clone this repo into a local dev environment then run bundler.

    $ bundle install
    $ bundle update
    
Once all the dependencies have been installed, the following rake tasks are defined:

    $ rake build
    $ rake serve
    $ rake serve[port_number]
    
To get the node.js server set up, run the following:
    
    $ cd server
    $ npm install
    $ node server.js

# Disclaimer

All images are copyright of Rob Shaw.

Source code is MIT licensed with no added caveats. See LICENSE file for more details.
