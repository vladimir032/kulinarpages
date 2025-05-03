# Dockerfile for frontend (React build)
FROM node:20-alpine as build
WORKDIR /app
COPY package*.json ./
RUN npm install --production
COPY . .
RUN npm run build

# Production image: only static files
FROM nginx:alpine
COPY --from=build /app/build /usr/share/nginx/html
# (Optional) Replace default nginx config if needed:
# COPY nginx.conf /etc/nginx/nginx.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
