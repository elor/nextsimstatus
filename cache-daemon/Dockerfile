FROM node:latest

RUN mkdir -p app

COPY *.js app/
COPY *.json app/

WORKDIR app/

RUN npm install

CMD [ "node", "." ]
