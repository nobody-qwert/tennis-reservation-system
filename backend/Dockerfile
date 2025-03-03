FROM node:18

WORKDIR /app

COPY package*.json ./

# Install dependencies including nodemon as a dev dependency
RUN npm install
RUN npm install -g nodemon

COPY . .

EXPOSE 5000

CMD ["npm", "run", "dev"]