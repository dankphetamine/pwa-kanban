FROM node:14-alpine AS base

# Create app directory
WORKDIR /app

# Copy dependencies over
COPY package.json ./
COPY yarn.lock ./

COPY prisma ./prisma/

# Install app dependencies (reuqires package.json)
RUN yarn install --frozen-lockfile

# Generate prisma client (requires prisma folder)
RUN yarn prisma generate

COPY . .

RUN yarn build

EXPOSE 3000

CMD [ "yarn", "start" ]