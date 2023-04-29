FROM node:16.19.0

WORKDIR /front_app

COPY package.json ./
COPY package-lock.json ./

ENV REACT_APP_API_HOST=http://localhost:8080

ENV REACT_APP_API_HOST_WS=localhost:8080

RUN npm install

EXPOSE 3000 

COPY . .

CMD ["npm", "start"]