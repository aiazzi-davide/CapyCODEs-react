#!/bin/bash

cd /app
if [ ! -f package.json ]; then
  rm .gitkeep
  npx -y create-react-app .
fi
sed -i 's/"start": "react-scripts start"/"start": "WATCHPACK_POLLING=true react-scripts start"/' package.json
npm install
npm install react-router-dom
npm install react-google-login
npm start