#!/bin/bash

NODE_VERSION="$(node --version)"

if [[ $NODE_VERSION =~ '0.10' ]]; then
  npm install jsdom@~3.*
else
  npm install jsdom@~4.*
fi
