# Stage 1: Dependency installation
FROM node:22-alpine AS deps
WORKDIR /app

# Install system dependencies needed for building
RUN apk add --no-cache libc6-compat python3 make g++

# Copy package files
COPY package.json package-lock.json ./

# Install dependencies using npm
RUN npm ci

# Stage 2: Application build
FROM node:22-alpine AS builder
WORKDIR /app

# Set environment variables for memory optimization
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
# Hard limit memory during build to prevent OOM on 2GB server
ENV NODE_OPTIONS="--max-old-space-size=1024"
# Limit Next.js build workers to reduce memory spikes
ENV NEXT_BUILD_WORKERS=1

# Copy node_modules from deps stage
COPY --from=deps /app/node_modules ./node_modules
# Copy application source
COPY . .

# Build the application
RUN npm run build

# Stage 3: Production runner
FROM node:22-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

# Create a system user for security
RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy essential files from builder
COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

# Healthcheck to verify the app is responding
HEALTHCHECK --interval=30s --timeout=5s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3000/api/health', (res) => { if (res.statusCode === 200) process.exit(0); else process.exit(1); })" || exit 1

CMD ["node", "server.js"]
