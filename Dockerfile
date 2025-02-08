# Use the official Node.js image as the base image
FROM node:18-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy package.json and package-lock.json to the working directory
COPY package*.json ./

# Install application dependencies
RUN npm ci --only=production && npm cache clean --forc

# Copy the rest of the application code to the working directory
COPY . .

# Expose the port your application runs on
EXPOSE 8000

# Define the command to run your application
CMD ["node", "src/index.js"]
