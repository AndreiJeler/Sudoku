FROM node:20.11.0 AS builder

WORKDIR /app
ARG RUN_ENV

COPY package.json package-lock.json ./
RUN npm install
COPY . .
RUN npx nx build sudoku

FROM nginx:1.21.1-alpine

COPY --from=builder /app/dist/sudoku/browser /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf

FROM mcr.microsoft.com/dotnet/aspnet:8.0 as build-env

EXPOSE 4200

CMD ["nginx", "-g", "daemon off;"]
