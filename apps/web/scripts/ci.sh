#!/usr/bin/env bash

# load in the environment variables from .env
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# exit if CI_DISABLED flag is "1"
if [ "$CI_DISABLED" = "1" ]; then
    echo "CI_DISABLED is set to 1. Exiting."
    exit 0
fi

# build app in lib mode, as some scripts depend on it
vite build --mode lib

# check types for script files
tsc -p tsconfig.ci.json --noEmit --allowJs

echo Starting data wak download...
npm run data-wak-download

echo Scraping data wak...
npm run scrape-data-wak

echo Generating gifs...
npm run generate-gifs

echo Generating static assets
npm run generate-static-assets

echo Generate sitemap.txt
npm run generate-sitemap

echo SSG
npx tsx ssg/index.ts