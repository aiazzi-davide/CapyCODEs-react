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
yarn add react-loading-skeleton
npm install react-loading-skeleton

npm i --save @fortawesome/fontawesome-svg-core
npm i --save @fortawesome/free-solid-svg-icons
npm i --save @fortawesome/free-regular-svg-icons
npm i --save @fortawesome/free-brands-svg-icons
npm i --save @fortawesome/react-fontawesome@latest

npm start