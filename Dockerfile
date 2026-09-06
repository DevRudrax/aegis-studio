# Aegis Studio - Enterprise Container for Google Cloud Run
FROM node:20-alpine AS production

# Set working directory
WORKDIR /app

# Install system dependencies if required for native modules
RUN apk add --no-cache libc6-compat

# Copy package descriptors
COPY package*.json ./

# Install production dependencies
RUN npm ci --omit=dev --ignore-scripts || npm install --omit=dev

# Copy application source code
COPY . .

# Set container environment variables for Cloud Run
ENV NODE_ENV=production
ENV PORT=8080

# Cloud Run expects the application to listen on PORT 8080
EXPOSE 8080

# Use non-root node user for hardened security posture
USER node

# Start Aegis Studio Express Engine
CMD ["node", "server.js"]
