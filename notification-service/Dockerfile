# notification-service/Dockerfile
FROM node:18
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
EXPOSE 6002
CMD ["node", "index.js"]
