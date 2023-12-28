# NodeJS Version 16
FROM node:18.16-buster-slim

# Copy Dir
COPY . ./app

# Work to Dir
WORKDIR /usr/src/app

# Install Node Package
RUN npm install --legacy-peer-deps

# Set Env
ENV NODE_ENV development
EXPOSE 3000

# Cmd script
CMD ["npm", "run", "dev"]
