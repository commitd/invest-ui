#!/bin/bash

# Install some global helpers
yarn global add lerna typedoc 

# Boostrap
yarn bootstrap

# Set up links for others
yarn link:libs
