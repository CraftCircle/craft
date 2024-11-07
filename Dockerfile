# Use an official Node.js runtime as a parent image
FROM node:18

# Set the working directory in the container
WORKDIR /app

# Copy the package.json and yarn.lock files to the container
COPY package.json yarn.lock ./

# Install dependencies
RUN yarn install

# Copy the rest of the application code to the working directory
COPY . .

# Build the application, specifically the "microservice" app in your monorepo
RUN yarn build

# Expose the port the app runs on
EXPOSE 3000

# Start the "microservice" application
CMD ["node", "dist/apps/microservice/main"]
