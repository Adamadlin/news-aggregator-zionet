# Update this line to use a newer version of Node.js
FROM node:16

# Set the working directory
WORKDIR /app

# Copy the package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the necessary port
EXPOSE 6000

# Run the application
CMD ["node", "index.js"]
