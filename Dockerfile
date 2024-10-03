# Use Alpine 18 as base image
FROM alpine:3.18

# Set environment variables to prevent prompts
ENV NODE_ENV=production

# Install Node.js and other dependencies
RUN apk add --no-cache nodejs npm

# Set the working directory inside the container
WORKDIR /usr/src/app

# Copy package.json and package-lock.json
COPY package*.json ./

# Install Node.js dependencies
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose port 3077
EXPOSE 3077

# Start the application
CMD ["node", "app.js"]
