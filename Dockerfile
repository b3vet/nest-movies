# Stage 1: Build
FROM node:23 AS builder

# Set working directory
WORKDIR /app

# Copy package.json and yarn.lock
COPY package.json yarn.lock .yarnrc.yml ./

# Install dependencies
RUN corepack enable && corepack prepare yarn@4.6.0 --activate && yarn install

# Copy the rest of the application code
COPY . .

# Build the application
RUN yarn build

# Stage 2: Production
FROM node:23-slim AS production

ENV NODE_ENV=production
# Set working directory
WORKDIR /app

# Copy built application from the builder stage
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/package.json ./package.json
COPY --from=builder /app/yarn.lock ./yarn.lock
COPY --from=builder /app/.yarnrc.yml ./.yarnrc.yml

# Install only production dependencies
RUN corepack enable && corepack prepare yarn@4.6.0 --activate && yarn install

# Copy the environment file
COPY .env.local .env

# Expose the port the app runs on
EXPOSE 3434

# Start the application
CMD ["yarn", "prod"]
