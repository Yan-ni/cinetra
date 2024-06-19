FROM node

WORKDIR /app

COPY . .

RUN npm install && cd ./frontend && npm install

CMD ["npm", "start"]
