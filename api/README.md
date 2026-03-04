# МойПроект — API

Backend сервис платформы **МойПроект** — white-label клиентского портала для российских IT-агентств и веб-студий.

## Стек

- **NestJS 11** + TypeScript (strict mode)
- **PostgreSQL** — основная БД
- **Yandex Object Storage** (S3) — хранение файлов
- **ЮKassa** — рублёвые платежи
- **Telegram Bot API** — уведомления

## Запуск

```bash
npm install
```

```bash
# dev с hot-reload
npm run start:dev

# production сборка
npm run build
npm run start:prod
```

## Скрипты

```bash
npm run lint          # проверка ESLint
npm run lint --fix    # автофикс
npm run format        # prettier
npm run test          # unit-тесты
npm run test:e2e      # e2e тесты
npm run test:cov      # покрытие
```

## Структура

```
src/
  app.module.ts       # корневой модуль
  main.ts             # точка входа, порт 3000
```

## Переменные окружения

| Переменная | Описание |
|---|---|
| `PORT` | Порт сервера (по умолчанию `3000`) |
| `DATABASE_URL` | Строка подключения к PostgreSQL |
| `YUKASSA_SHOP_ID` | ID магазина ЮKassa |
| `YUKASSA_SECRET_KEY` | Секретный ключ ЮKassa |
| `TELEGRAM_BOT_TOKEN` | Токен Telegram-бота |
| `S3_BUCKET` | Бакет Yandex Object Storage |
| `S3_ACCESS_KEY` | Access key S3 |
| `S3_SECRET_KEY` | Secret key S3 |
