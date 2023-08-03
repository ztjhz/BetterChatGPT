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
# ENV VITE_SERVER_API_ENDPOINT "https://api.qna3.ai"
ENV VITE_SERVER_API_ENDPOINT ${VITE_SERVER_API_ENDPOINT}
ENV VITE_OPENAI_API_KEY ${VITE_OPENAI_API_KEY}
RUN yarn build

EXPOSE 3000
CMD ["/home/appuser/.yarn/bin/serve", "-s", "dist", "-l", "3000"]