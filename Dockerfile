FROM node:14-alpine

WORKDIR /app

COPY package.json next.config.js .babelrc config.json ./

RUN yarn

COPY ./component ./component
COPY ./layout ./layout
COPY ./lib ./lib
COPY ./public ./public
COPY ./widget ./widget
COPY ./pages ./pages

RUN npm run build

ENV PORT=80

EXPOSE 80

CMD ["npm", "start"]