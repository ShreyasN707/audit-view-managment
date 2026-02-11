# Build Stage
FROM node:18-alpine as build

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

# Production Stage (Nginx to serve static files)
# We can use the main Nginx container to serve, or have this container serve itself.
# Plan says: "served via Nginx or separate container".
# Let's use a lightweight webserver or just serve dist via the main Nginx volume.
# For simplicity in this Compose setup, let's just expose the built files or run a simple server.
# Development mode in docker-compose uses `npm run dev`.
# For production readiness, we usually serve static files.

# However, given the USER REQUEST "make it deployment ready", 
# and the docker-compose has `command: npm run dev`, that's for DEV.
# I should provide a PROD ready Dockerfile.

# Let's stick to the request: "minimal react and docker".
# Using `npm run dev` in docker-compose is fine for dev.
# But for "Deployment Ready", we should have a production option.
# I will create a Dockerfile that CAN be used for prod.

FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
