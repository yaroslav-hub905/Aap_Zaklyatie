# Заклятые

Карточная игра для компании: белая колода «Клятва» сплачивает, чёрная «Проклятие» ссорит.

Проект живёт в двух местах, и они **не зависят друг от друга**:

| | Где работает | Адрес | Что нужно |
|---|---|---|---|
| **Приложение** для экрана телефона | GitHub Pages | https://yaroslav-hub905.github.io/Aap_Zaklyatie/ | ничего, бесплатно |
| **Бот** с мини-игрой внутри Telegram | Railway | ваш домен `*.up.railway.app` | токен бота |

Если Railway выключится, приложение продолжит работать. Если GitHub Pages выключить, бот продолжит работать: у него своя копия игры.

## Что в папке

| Файл | Зачем |
|---|---|
| `zaklyatye.html` | Сама игра: карты, правила, анимации. Общий исходник для приложения и бота. |
| `docs/` | Готовое приложение для GitHub Pages. **Руками не править** — собирается командой `npm run build`. |
| `scripts/build-pages.mjs` | Сборка приложения: игра + иконки + офлайн-режим + установка на экран. |
| `bot/server.mjs` | Бот для Railway: отвечает в Telegram и открывает игру внутри Telegram. |
| `bot/cover.png`, `bot/avatar.png` | Обложка приветствия и аватарка бота. Исходники — `.html` рядом. |
| `bot/icons/` | Иконки приложения (сделаны из аватарки). |

## Приложение (GitHub Pages)

**Включить один раз:** репозиторий на github.com → **Settings** → **Pages** →
Source: **Deploy from a branch**, Branch: **main**, папка **/docs** → **Save**.
Через 1–2 минуты приложение откроется по адресу https://yaroslav-hub905.github.io/Aap_Zaklyatie/

Что внутри:
- при первом открытии — экран «Поставь на экран» с анимированной инструкцией для iPhone и Android;
- на Android в Chrome — кнопка «Установить одним нажатием»;
- после установки — своя иконка, весь экран без адресной строки, работает без интернета;
- «Позвать друзей» на главном экране отправляет ссылку через обычное меню «Поделиться».

**Обновить приложение** после правок в игре:

```bash
npm run build && git add . && git commit -m "Обновил игру" && git push
```

## Бот (Railway)

1. [railway.com](https://railway.com) → **New Project** → **Deploy from GitHub repo** → `Aap_Zaklyatie`.
2. **Variables** → `BOT_TOKEN` = токен от [@BotFather](https://t.me/BotFather).
3. **Settings → Networking** → **Generate Domain**.
4. В логах появится `Бот запущен`. В Telegram отправьте боту `/start`.

Что умеет: приветствие с обложкой, кнопка **Играть** (игра открывается внутри Telegram), `/rules`, `/app` (ссылка на приложение для экрана телефона).
Кнопка «📲 Поставить на экран телефона» ведёт на GitHub Pages. Другой адрес можно задать переменной `APP_URL`.

Railway пересобирает бота сам после каждого `git push`.

## Как менять

- **Карты:** `zaklyatye.html` → массив `DECK`, разделы `white` и `black`.
  `t` — тип (`q` вопрос, `a` действие, `all` всем, `c` выбор), `{p}` — подставится имя случайного игрока.
  После правок: `npm run build`, затем `git push` — обновятся и приложение, и бот.
- **Тексты бота:** `bot/server.mjs` → `WELCOME` и `RULES`.
- **Обложка / аватарка:** поправьте `bot/cover.html` или `bot/avatar.html` и пересоберите картинку:

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --window-size=1280,720 --virtual-time-budget=6000 --screenshot="$PWD/bot/cover.png" "file://$PWD/bot/cover.html"
```

```bash
"/Applications/Google Chrome.app/Contents/MacOS/Google Chrome" --headless=new --hide-scrollbars --window-size=640,640 --virtual-time-budget=6000 --screenshot="$PWD/bot/avatar.png" "file://$PWD/bot/avatar.html"
```

Аватарку ставят в [@BotFather](https://t.me/BotFather) → `/setuserpic` → бот → `avatar.png` как фото.

## Проверить у себя

```bash
npm start
```

Бот-версия игры откроется на http://localhost:3000 (без `BOT_TOKEN` работает только игра).
