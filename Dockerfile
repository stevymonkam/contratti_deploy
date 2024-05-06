FROM node:20.11.0-alpine as build
WORKDIR /app

RUN npm install -g @angular/cli

COPY ./package.json .
RUN npm install --force
COPY . .
RUN ng build

FROM nginx as runtime
COPY --from=build /app/dist/test1 /usr/share/nginx/html
