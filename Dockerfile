FROM node:18

WORKDIR /usr/src/app

COPY package*.json ./
RUN npm install
COPY . .

RUN npm run build # Assuming you have a build script in package.json

EXPOSE 3000

CMD ["npm", "run", "start"] # Replace with your actual start script
