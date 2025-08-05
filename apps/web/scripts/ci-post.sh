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

echo SSG
npm run generate-statis-site

# Sentry upload source maps
if [ -z "$SENTRY_AUTH_TOKEN" ]; then
    echo "SENTRY_AUTH_TOKEN is empty. Skipping source map upload."
    exit 0
fi

# https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/cli/
sentry-cli sourcemaps inject dist
sentry-cli sourcemaps upload dist

# delete sourcemaps, to not take up space in the production deployment
rm ./dist/*.map
rm ./dist/**/*.map