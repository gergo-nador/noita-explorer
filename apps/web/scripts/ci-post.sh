# Sentry upload source maps
if [ -z "$SENTRY_AUTH_TOKEN" ]; then
    echo "SENTRY_AUTH_TOKEN is empty. Skipping source map upload."
    exit 0
fi

# https://docs.sentry.io/platforms/javascript/sourcemaps/uploading/cli/
sentry-cli sourcemaps inject dist
sentry-cli sourcemaps upload dist

# delete sourcemaps, they just take up space
rm ./dist/*.map
rm ./dist/**/*.map