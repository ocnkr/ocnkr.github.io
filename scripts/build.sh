#!/bin/sh
set -eu
if [ -d /opt/homebrew/opt/ruby@3.4/bin ]; then
  PATH="/opt/homebrew/opt/ruby@3.4/bin:$PATH"
fi
export PATH
JEKYLL_ENV=production bundle exec jekyll build "$@"
