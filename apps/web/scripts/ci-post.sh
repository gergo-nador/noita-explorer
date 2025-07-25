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