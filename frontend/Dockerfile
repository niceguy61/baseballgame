# Use official Node.js image as a base
FROM node:14

# Create app directory
WORKDIR /app

# Copy package files and install dependencies
COPY package*.json ./
RUN npm install

# Copy the rest of the application files, including public
COPY . .

# Expose the frontend port
EXPOSE 3000

# Set environment variables
ENV REACT_APP_API_URL=http://backend:5000

# Start the React development server
CMD ["npm", "start"]
