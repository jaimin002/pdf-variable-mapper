## --- Base image ---
FROM node:20-alpine AS base
WORKDIR /app

## --- Dependencies layer (cached) ---
FROM base AS deps
RUN apk add --no-cache libc6-compat
COPY package.json package-lock.json* ./
RUN npm ci

## --- Build layer ---
FROM base AS build
ENV NODE_ENV=production
COPY --from=deps /app/node_modules ./node_modules
COPY . .
RUN npm run build

## --- Runtime image ---
FROM base AS runner
ENV NODE_ENV=production

## Next.js uses this port by default
EXPOSE 3000

## Create non-root user
RUN addgroup -S nextjs && adduser -S nextjs -G nextjs
USER nextjs

WORKDIR /app

COPY --from=build /app/public ./public
COPY --from=build /app/.next ./.next
COPY --from=build /app/package.json ./package.json
COPY --from=deps /app/node_modules ./node_modules

CMD ["npm", "run", "start"]

