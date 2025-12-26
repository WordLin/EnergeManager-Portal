# syntax=docker/dockerfile:1

FROM node:20-bookworm-slim AS build
WORKDIR /app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

FROM nginx:1.25-alpine
ENV BACKEND_URL=http://host.docker.internal:8000

# 将构建产物放入 Nginx 默认站点
COPY --from=build /app/dist /usr/share/nginx/html

# 使用模板支持运行时注入后端地址
COPY docker/nginx/default.conf.template /etc/nginx/templates/default.conf.template

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]

