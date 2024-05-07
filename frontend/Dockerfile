# Use official Node.js image as a base
FROM node:14

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files
COPY . .

# Expose the frontend port
EXPOSE 3000

# Start the React development server
CMD ["npm", "start"]
