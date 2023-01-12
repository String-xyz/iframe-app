FROM node:18.0.0

# install dependencies
WORKDIR /app
# Copy all local files into the image.
COPY . .
 
RUN yarn
RUN yarn build

FROM node:18-slim

WORKDIR /app
COPY --from=0 /app .
COPY . .

EXPOSE 3000
CMD ["node", "./build"]
