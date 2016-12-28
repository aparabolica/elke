#!/bin/bash
set -e
chown -R $WWW_USER:$WWW_USER $DATA
exec "$@"
