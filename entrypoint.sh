#!/bin/bash
set -e
chown -R $APP_USER:$APP_USER $DATA
exec "$@"
