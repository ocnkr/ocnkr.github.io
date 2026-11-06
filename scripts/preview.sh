#!/bin/sh
set -eu
if [ -d /opt/homebrew/opt/ruby@3.4/bin ]; then
  PATH="/opt/homebrew/opt/ruby@3.4/bin:$PATH"
fi
export PATH
exec bundle exec jekyll serve --config _config.yml,_config.dev.yml --host 127.0.0.1 --port 4000 --livereload "$@"
