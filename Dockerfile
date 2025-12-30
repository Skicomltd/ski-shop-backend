# ---- Base ----
FROM node:22-alpine AS base
WORKDIR /app

# ---- Dependencies ----
FROM base AS deps
COPY package*.json ./
RUN npm ci

# ---- Build ----
FROM deps AS build
COPY . .
RUN npm run build

# ---- Production ----
FROM base AS production
ENV NODE_ENV=production

COPY --from=deps /app/node_modules ./node_modules
COPY --from=build /app/dist ./dist
COPY package*.json ./
COPY docker-entrypoint.sh /usr/local/bin/docker-entrypoint.sh

RUN chmod +x /usr/local/bin/docker-entrypoint.sh

EXPOSE 3000

ENTRYPOINT ["docker-entrypoint.sh"]
CMD ["node", "dist/src/main.js"]
