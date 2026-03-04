# --- Сборка ---
FROM node:18-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm install
COPY . .
RUN npm run build

# --- Запуск ---
FROM node:18-alpine
WORKDIR /app
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

# NestJS по умолчанию слушает 3000, Yandex Serverless передает PORT через переменную
ENV PORT=3000
EXPOSE 3000

CMD ["node", "dist/main"]
