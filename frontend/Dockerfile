FROM node:17 as build-stage

WORKDIR /frontend
COPY package.json .
RUN npm install
COPY . .

ARG REACT_APP_API_BASE_URL
ENV REACT_APP_API_BASE_URL=${REACT_APP_API_BASE_URL}

RUN npm run build

# NGINX setup
FROM nginx:alpine

COPY --from=build-stage /frontend/build /usr/share/nginx/html
EXPOSE 80

CMD nginx -g 'daemon off;'