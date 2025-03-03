FROM node:18

WORKDIR /app

COPY package*.json ./

# Install dependencies
RUN npm install

COPY . .

EXPOSE 5173

# Run our simple Express server
CMD ["npm", "run", "dev"]