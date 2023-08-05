FROM node:alpine

RUN addgroup -S appgroup && \
  adduser -S appuser -G appgroup && \
  mkdir -p /home/appuser/app && \
  chown appuser:appgroup /home/appuser/app
USER appuser

RUN yarn config set prefix ~/.yarn && \
  yarn global add serve

WORKDIR /home/appuser/app
COPY --chown=appuser:appgroup package.json yarn.lock ./
RUN npm install
COPY --chown=appuser:appgroup . .
ARG VITE_SERVER_API_ENDPOINT
ARG VITE_OPENAI_API_KEY
ARG VITE_AUTH0_ID
ARG VITE_RUNTIME_ENV
ARG VITE_SENTRY_AUTH_TOKEN

ENV VITE_SERVER_API_ENDPOINT ${VITE_SERVER_API_ENDPOINT}
ENV VITE_OPENAI_API_KEY ${VITE_OPENAI_API_KEY}
ENV VITE_AUTH0_ID ${VITE_AUTH0_ID}
ENV VITE_RUNTIME_ENV ${VITE_RUNTIME_ENV}
ENV VITE_SENTRY_AUTH_TOKEN ${VITE_SENTRY_AUTH_TOKEN}

RUN yarn build

EXPOSE 3000
CMD ["/home/appuser/.yarn/bin/serve", "-s", "dist", "-l", "3000"]