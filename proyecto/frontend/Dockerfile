FROM node:alpine

WORKDIR /front_app

COPY package.json ./
COPY package-lock.json ./

ENV REACT_APP_API_HOST=http://34.66.250.137:8080

ENV REACT_APP_API_HOST_WS=34.66.250.137:8080

RUN npm install

EXPOSE 3000 

COPY . .

CMD ["npm", "start"]