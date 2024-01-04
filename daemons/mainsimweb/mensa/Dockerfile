FROM node:14

RUN mkdir -p app

COPY *.js app/
COPY *.json app/

WORKDIR /app/

RUN npm install && npm audit fix

CMD [ "node", "." ]
