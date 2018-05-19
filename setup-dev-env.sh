#!/bin/bash

# Install some global helpers
yarn global add lerna typedoc 

# Boostrap
yarn boostrap

# Set up links for others
call yarn link:libs
