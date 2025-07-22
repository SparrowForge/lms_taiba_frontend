# Use the official Node.js runtime as the base image
FROM node:18-alpine AS base

# Install Bun and other dependencies
RUN apk add --no-cache libc6-compat curl unzip bash
RUN curl -fsSL https://bun.sh/install | bash
ENV PATH="/root/.bun/bin:$PATH"
RUN bun --version

# Install dependencies only when needed
FROM base AS deps
WORKDIR /app

# Copy package files for better caching
COPY package.json bun.lock* ./

# Use cache mount for faster dependency installation
RUN --mount=type=cache,target=/root/.bun/install/cache \
    bun install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app

# Copy dependencies from deps stage
COPY --from=deps /app/node_modules ./node_modules

# Copy source files
COPY . .

# Set build environment
ENV NEXT_TELEMETRY_DISABLED 1
ENV NODE_ENV production

# Use cache mount for faster builds
RUN --mount=type=cache,target=/app/.next/cache \
    bun run build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV NEXT_TELEMETRY_DISABLED 1

# Create system user
RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

# Copy public assets
COPY --from=builder /app/public ./public

# Set up Next.js directory with correct permissions
RUN mkdir .next && chown nextjs:nodejs .next

# Copy built application
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000
ENV HOSTNAME "0.0.0.0"

# Health check for better container management
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD curl -f http://localhost:3000/api/health || exit 1

CMD ["node", "server.js"] 