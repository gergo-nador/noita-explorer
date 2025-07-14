#!/usr/bin/env bash

if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

if [ "$CI_DISABLED" = "1" ]; then
    echo "CI_DISABLED is set to 1. Exiting."
    exit 0
fi

# Run CI pipeline
echo Starting data wak download...
npm run data-wak-download

echo Scraping data wak...
npm run scrape-data-wak

echo Generating gifs...
npm run generate-gifs

echo Generating static assets
npm run generate-static-assets