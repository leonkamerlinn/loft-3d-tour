FROM node:22-alpine

WORKDIR /app

COPY package*.json ./
RUN npm ci --omit=dev --no-audit --no-fund

COPY index.html styles.css app.js walk.js measure.js spec-data.js majstor.html majstor.css majstor.js server.js ./
COPY assets ./assets

ENV NODE_ENV=production
ENV PORT=8080

# Run as the unprivileged user that ships with the official Node image
USER node

EXPOSE 8080

CMD ["node", "server.js"]
