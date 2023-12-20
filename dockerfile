FROM node:18.16-alpine3.16
ENV SERVER_PORT=9102
ENV SCRIPT=nodemon
RUN mkdir -p /home/node/app/node_modules && chown -R node:node /home/node/app
WORKDIR /home/node/app
COPY package*.json ./
COPY tsconfig.json ./
COPY vite.config.ts ./
USER node
RUN yarn
COPY --chown=node:node . .
EXPOSE ${SERVER_PORT}
CMD yarn ${SCRIPT}