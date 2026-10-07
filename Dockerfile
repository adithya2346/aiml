FROM node:20-slim

WORKDIR /app

# Install dependencies (better-sqlite3 provides prebuilt Linux binaries)
COPY package*.json ./
RUN npm install --omit=dev

# Copy application files
COPY . .

EXPOSE 3000

ENV NODE_ENV=production

CMD ["npm", "start"]
