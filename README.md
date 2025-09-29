# YellowCars — лендинг

Современный одностраничный лендинг для компании по поставке авто из Китая в Беларусь. Тёмная тема, акцентные жёлтые вставки, адаптивная вёрстка, SEO.

## Локальный запуск

Требуется Node.js 18+.

```bash
npm install
npm run dev
```

Откройте `http://localhost:5173`.

## Превью (статический сайт)

```bash
npm run preview
```

## Деплой на хостинге с доменом

Лендинг статический. Нужна раздача содержимого папки `public/` на вашем домене.

1. Загрузите содержимое `public/` в корень сайта на хостинге.
2. Убедитесь, что отдаются файлы: `index.html`, `styles.css`, `scripts.js`, `robots.txt`, `sitemap.xml`, `site.webmanifest`, изображения и иконки.
3. Обновите в `index.html` и `sitemap.xml` канонический URL (`https://your-domain.example`) на ваш домен.
4. Проверьте SSL (HTTPS), редирект с `http` на `https`, корректный `Content-Type` для `xml`, `webmanifest`.
5. Включите кэширование статики на уровне веб-сервера (Nginx/Apache) и сжатие `gzip`/`brotli`.

### Быстрый деплой (варианты)
- Nginx: раздайте `public/` как `root`. Локации:
  - `location = /sitemap.xml { types { application/xml xml; } }`
  - `location = /site.webmanifest { types { application/manifest+json webmanifest; } }`
- Netlify/Vercel: просто укажите папку `public/` как `Publish directory`.

## Контент, который стоит уточнить
- Телефон, email, ссылки на мессенджеры и соцсети
- Точные тексты блока «О компании» и преимущества
- Реквизиты компании для футера, политика конфиденциальности
- Медиа: лого (`logo.svg`), обложка для `og-image` (`/images/og-cover.jpg`), видео `hero.mp4`

## SEO
- Метатеги OpenGraph/Twitter, `robots.txt`, `sitemap.xml`, `JSON-LD` для `Organization`
- Семантическая вёрстка, lazy-оптимизация медиа, корректные `alt`

## Структура
```
public/
  index.html
  styles.css
  scripts.js
  robots.txt
  sitemap.xml
  site.webmanifest
  images/ ...
  brands/ ... (svg логотипы)
  media/hero.mp4
```
