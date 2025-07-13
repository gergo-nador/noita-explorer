#!/bin/bash

# Load the .env file
if [ -f .env ]; then
    export $(grep -v '^#' .env | xargs)
fi

# Check the variable (replace MY_FLAG with your variable name)
if [ "$CI_DISABLED" = "1" ]; then
    echo "CI_DISABLED is set to 1. Exiting."
    exit 0
fi

# Run CI pipeline
npm run data-wak-download
npm run scrape-data-wak
npm run generate-gifs
npm run generate-static-assets