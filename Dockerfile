# Use Bun official image
FROM oven/bun:latest

# Set working directory
WORKDIR /app

# Copy package.json, lock files, and .npmrc for registry configuration
COPY package.json bun.lockb .npmrc ./

# Install dependencies
RUN bun install

# Copy the rest of the application code
COPY . .

# Expose the port that Vite uses by default
EXPOSE 5173

# Set environment variable to ensure Vite accepts connections from any host
ENV HOST=0.0.0.0
ENV PORT=5173

# Run the development server using bun run dev (which now uses bunx vite)
CMD ["bun", "run", "dev", "--host", "0.0.0.0", "--port", "5173"] 