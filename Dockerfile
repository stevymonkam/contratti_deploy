FROM node:16.13-alpine as build
WORKDIR /app

RUN npm install -g @angular/cli

COPY ./package.json .
COPY . .
ENV API_URL=$API_URL
RUN npm install

RUN ng build

FROM nginx as runtime
COPY --from=build /app/dist/test1 /usr/share/nginx/html

# Run the app.  CMD is required to run on Heroku
# $PORT is set by Heroku			
CMD gunicorn --bind 0.0.0.0:$PORT wsgi 
