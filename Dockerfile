FROM node:alpine
WORKDIR /app
COPY package*.json ./

# ---- Dependencies ----
FROM base AS dependencies
RUN npm ci

# ---- Build ----
FROM dependencies AS build
COPY . .
RUN npm run build

FROM node:19-alpine AS production
WORKDIR /app
COPY --from=dependencies /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY --from=build /app/public ./public
COPY --from=build /app/package*.json ./

RUN yarn config set prefix ~/.yarn && \
  yarn global add serve
ARG VITE_SERVER_API_ENDPOINT
ARG VITE_OPENAI_API_KEY
ENV VITE_SERVER_API_ENDPOINT ${VITE_SERVER_API_ENDPOINT}
ENV VITE_OPENAI_API_KEY ${VITE_OPENAI_API_KEY}

EXPOSE 3000
CMD ["/home/appuser/.yarn/bin/serve", "-s", "dist", "-l", "3000"]
