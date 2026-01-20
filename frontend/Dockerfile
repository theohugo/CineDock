FROM node:20-alpine

WORKDIR /app

# Copy package metadata first to leverage Docker layer caching
COPY package*.json ./

# Bring in the rest of the source code (overridden by volume mounts in dev)
COPY . .

EXPOSE 5173

# Install dependencies at runtime (handles bind mounts) then start Vite dev server
CMD ["sh", "-c", "npm install && npm run dev -- --host 0.0.0.0 --port 5173"]
