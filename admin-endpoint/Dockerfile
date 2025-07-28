# Build stage
FROM node:18-alpine AS builder

# Set DNS servers
RUN echo "nameserver 178.22.122.100" > /etc/resolv.conf && \
    echo "nameserver 185.51.200.2" >> /etc/resolv.conf

WORKDIR /app

# Set npm config to use DNS
RUN npm config set registry https://registry.npmjs.org/ && \
    npm config set strict-ssl false

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# Production stage
FROM node:18-alpine AS runner
WORKDIR /app

ENV NODE_ENV production

COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

CMD ["node", "server.js"] 