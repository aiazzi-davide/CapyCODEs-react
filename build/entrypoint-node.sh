#!/bin/bash

cd /app
if [ ! -f package.json ]; then
  rm .gitkeep
  npx -y create-react-app . 
fi
npm install
npm start
