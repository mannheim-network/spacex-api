#!/bin/bash

PACKAGE_VERSION=$(cat package.json \
  | grep version \
  | head -1 \
  | awk -F: '{ print $2 }' \
  | sed 's/[",]//g' \
  | tr -d '[[:space:]]')
IMAGEID="mannheim-network/spacex-api:$PACKAGE_VERSION"
echo "Building mannheim-network/spacex-api:$PACKAGE_VERSION ..."
docker build -t $IMAGEID .
