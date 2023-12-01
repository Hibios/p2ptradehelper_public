FROM node:latest
WORKDIR /app
COPY package.json ./
COPY package-lock.json ./
COPY . .
RUN npm i webpack webpack-cli --save-dev
RUN npm i @babel/core babel-loader @babel/preset-env @babel/preset-react --save-dev
RUN npm i react react-dom --save-dev
CMD ["npm", "run", "build"]
