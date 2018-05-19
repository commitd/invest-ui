#!/bin/bash

# Install some global helpers
yarn global add lerna typedoc 

# Boostrap
yarn boostrap

# Setup the Web side with a yarn install to get all the dependencies
yarn install
