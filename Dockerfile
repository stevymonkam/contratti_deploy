FROM node:16.13-alpine as build
WORKDIR /app

RUN npm install -g @angular/cli

COPY ./package.json .
COPY . .
RUN npm install

RUN ng build

FROM nginx as runtime
COPY --from=build /app/dist/test1 /usr/share/nginx/html
