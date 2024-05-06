FROM node:20.12.2

WORKDIR usr/src/app

COPY . .
COPY ./.env ./.env

RUN npm install --quiet --no-optional --no-fund --loglevel=error

EXPOSE 3000

RUN npm run build

CMD ["npm","run" ,"start:prod"]


