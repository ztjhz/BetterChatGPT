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
RUN yarn install --frozen-lockfile
COPY --chown=appuser:appgroup . .

RUN yarn build
EXPOSE 3000

CMD ["/home/appuser/.yarn/bin/serve", "-s", "dist", "-l", "3000"]
