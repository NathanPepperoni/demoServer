FROM node:10
COPY package*.json ./
EXPOSE 8080
RUN npm install
COPY . .
CMD ["npm", "start"]