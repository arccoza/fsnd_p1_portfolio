---
title: Portfolio
date: 2016-12-27T12:00:00+09:00
collection: projects
description: 'Project #1 of FSND, a portfolio site.'
media:
  images:
    screenshot:
      thumb: '/projects/fsnd_p1_portfolio/screen-w160.jpg'
      thumb2x: '/projects/fsnd_p1_portfolio/screen-w320.jpg'
      tile: '/projects/fsnd_p1_portfolio/screen-w320.jpg'
      tile2x: '/projects/fsnd_p1_portfolio/screen-w640.jpg'
      half: '/projects/fsnd_p1_portfolio/screen-w640.jpg'
      half2x: '/projects/fsnd_p1_portfolio/screen-w1280.jpg'
      full: '/projects/fsnd_p1_portfolio/screen-w1280.jpg'
      orig: '/projects/fsnd_p1_portfolio/screen.jpg'
---

# {{title}}
Project #1 of FSND

A portfolio static site generated with Gulp.
All source files are in `src` and `semantic`.
All built files are in `pub`.

All development and testing was done on Linux (elementary OS 0.4 / Ubuntu 16.04) and Node.js v6.9.2, running the project under Windows was not tested, but it should run.

A modern browser (IE 11 / Edge, current versions of Chrome / Firefox / Safari) that supports current flexbox is required to view the site.

An internet connection is required to access online resources.

## Download and Setup

### Download
To download this project either:
- Clone this repo with `https://github.com/arccoza/fsnd_p1_portfolio.git`
- Or download it as an archive from [here](https://github.com/arccoza/fsnd_p1_portfolio/archive/master.zip) and unzip.

### Setup
Once you have the project in the `fsnd_p1_portfolio` directory (or wherever you put it) ensure you have a recent version of NPM and Node.js installed (>= v6.9.2), instructions for installing Node.js on your platform can be found [here](https://nodejs.org/en/download/package-manager/). Once that's all done, install the projects dependencies, like so:

1. Navigate to the project folder from the terminal.
2. From the terminal in the project folder type `npm install`.
3. NPM should successfully install the projects dependencies.
4. Install Gulp globally with `npm install -g gulp-cli` or `sudo npm install -g gulp-cli` for linux/osx.
5. Install Serve globally with `npm install -g serve` or `sudo npm install -g serve` for linux/osx.

## Building and Running
To build and run the static site do:

1. From the project folder in terminal type `gulp build`, this will build the entire project.
  - There are other build options available, but you should run a complete build at least once.
  - `build:site` will build only the html, javascript and images required for the site. Run this when modifying content in the `src` folder.
    - `watch:site` will watch the `src` folder for changes and rebuild as needed.
  - `build:ui` will build only the CSS and javascript required for site layout and elements. Run this when modifying content in the `semantic` folder.
    - `watch:ui` will watch the `semantic` folder for changes and rebuild as needed.
  - `watch` will watch both the `src` and `semantic` folders for changes.
2. After building the site, run `server pub -c` from the terminal inside the project folder to launch a webserver on [http://localhost:3000/](http://localhost:3000/) hosting the files in the `pub` folder.
3. Open [http://localhost:3000/](http://localhost:3000/) in your browser to view the site.

## Usage
The site is fully responsive, test it with dev tools. Hover over images in the Portfolio section and click the view button to see a modal with more info about the project.

## Caveats and Additional Info

### Site CSS
The project uses the Semantic UI framework, using LESS.
You can find the sites source CSS and LESS from the project folder in `semantic/src/site/`.

These files contain site CSS and LESS:
- `globals/reset.overrides`
- `globals/site.overrides`
- `globals/site.variables`
- `views/card.overrides`
- `views/card.variables`
- `collections/grid.variables`
- `elements/container.overrides`
- `elements/divider.variables`
- `modules/modal.overrides`

All other site content is in the `src` folder.

### Watchers
There is a bug in the version of Gaze used by Gulp which will sometimes cause the watcher to crash, until the fix makes it into Gulp, just restart the watcher.