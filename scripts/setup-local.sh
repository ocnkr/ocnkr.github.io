#!/bin/sh
set -eu

# Homebrew installs these supported runtimes as keg-only packages on macOS.
if [ -d /opt/homebrew/opt/ruby@3.4/bin ]; then
  PATH="/opt/homebrew/opt/ruby@3.4/bin:$PATH"
fi
if [ -d /opt/homebrew/opt/node@24/bin ]; then
  PATH="/opt/homebrew/opt/node@24/bin:$PATH"
fi
export PATH

bundle config set --local path vendor/bundle
bundle install
npm install --cache .cache/npm
PLAYWRIGHT_BROWSERS_PATH=.cache/ms-playwright npx playwright install chromium
