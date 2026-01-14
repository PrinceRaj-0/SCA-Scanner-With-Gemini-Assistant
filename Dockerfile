# Build Stage for Frontend
FROM node:20-alpine as frontend-build
WORKDIR /app/client
COPY client/package*.json ./
RUN npm install
COPY client/ ./
RUN npm run build

# Setup Backend and Production Server
FROM node:20-alpine
WORKDIR /app

# Install system dependencies (Trivy and Curl)
RUN apk add --no-cache curl \
    && curl -sfL https://raw.githubusercontent.com/aquasecurity/trivy/main/contrib/install.sh | sh -s -- -b /usr/local/bin

# Setup Backend
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --production

# Copy Backend Code
COPY server/ ./

# Copy Built Frontend from previous stage
COPY --from=frontend-build /app/client/dist ./public

# Updates to your server/index.js will be needed to serve these static files
# We will use an environment variable to tell the server where the static files are
ENV PORT=3000
ENV NODE_ENV=production

EXPOSE 3000

CMD ["node", "index.js"]
