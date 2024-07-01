# Etapa de compilación
FROM node:16.16.0 as build
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build --prod

# Etapa de producción
FROM nginx:latest
COPY --from=build /app/dist/ /usr/share/nginx/html
EXPOSE 4200
CMD ["nginx", "-g", "daemon off;"]