#!/bin/bash
set -e
if [ "$1" = 'nginx' ]; then
  chown -R $WWW_USER:$WWW_USER $DATA
fi
exec "$@"
