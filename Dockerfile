FROM node:16-alpine

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

ENV PORT=3000

EXPOSE 3000

CMD ["npm", "start"]