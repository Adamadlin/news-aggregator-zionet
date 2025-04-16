# Use an official Node.js runtime as a base image
FROM node:18

# Set the working directory
WORKDIR /app

# Copy package.json and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application code
COPY . .

# Build the frontend application
RUN npm run build

# Expose port 3000
EXPOSE 3000

# Serve the built app using a lightweight web server (like serve)
RUN npm install -g serve
CMD ["serve", "-s", "build", "-l", "3000"]
