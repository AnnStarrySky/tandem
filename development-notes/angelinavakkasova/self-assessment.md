# Self-Assessment

> PR: []()

---

## История разработки и личные мысли

Сегодня я наконец могу нормально оглянуться назад и понять, какой путь прошла с этим проектом.  
Честно — это оказалось намного сложнее, чем я думала в начале.

Когда мы только начинали, всё казалось очень большим и непонятным. В команде было много вопросов: с чего стартовать, как делить задачи, как собирать всё в один продукт, как договориться по структуре и подходам. Меня, если честно, в начале это даже немного пугало. Когда работаешь одна, всё проще: сама решила, сама сделала, сама переделала. В команде всё по-другому — у каждого своё видение, свои идеи, свой темп, и это нужно не просто выслушать, а реально собрать в одно целое.

Примерно через пару недель проект начал оживать, и это было очень классное ощущение. Появились первые работающие страницы, маршруты, какая-то связная логика. Особенно сильно я это почувствовала тогда, когда начала делать тренажёры. В этот момент стало понятно, что я уже не просто “рисую UI”, а строю отдельную систему внутри проекта.

Я отвечала за **авторизацию, тренажёры и настройки профиля**, и сначала это правда выглядело как просто несколько экранов. Но потом выяснилось, что за каждым экраном скрывается целый пласт логики:

- вход и регистрация
- защита приватных страниц
- уровни сложности
- разные типы заданий
- проверка ответов
- прогресс пользователя
- сохранение результатов
- тема, язык, звук
- настройки профиля

### Авторизация

Отдельным большим блоком для меня стала авторизация. Я делала auth flow через **NextAuth**: логин, регистрацию, OAuth через GitHub и Google, protected routes и redirect-логику. Мне было важно, чтобы это не выглядело как две формы “ради галочки”, а ощущалось как нормальный пользовательский сценарий: человек заходит, регистрируется или логинится, попадает в dashboard и дальше уже спокойно работает с приложением.

В процессе оказалось, что авторизация — это не только UI, а ещё и много инфраструктуры вокруг:

- как хранить session
- как обновлять пользователя после изменения профиля
- как развести mock mode и backend mode
- как сделать так, чтобы auth pages, settings и приватные страницы не конфликтовали между собой

В итоге auth flow получился одной из ключевых частей проекта, потому что с него по сути начинается весь путь пользователя.

### Тренажёры

Самая большая и любимая часть для меня — это система тренажёров.  
Я сделала тренажёр с уровнями сложности:

- `easy`
- `medium`
- `hard`

и с разными типами заданий:

- **quiz**
- **code completion**
- **code editor**

Самым интересным было даже не оформить это визуально, а продумать саму механику:

- как пользователь выбирает тему
- как выбирает сложность
- как запускается конкретное задание
- как определяется, какой именно тренажёр показывать
- как считается score
- как считаются earned points
- как сохраняется прогресс
- что показывать пользователю в финале
- как вести его дальше после завершения

Для меня важным шагом было то, что я вынесла данные тренажёров в **JSON**, а не оставила всё захардкоженным внутри компонентов. После этого проект сразу стал ощущаться намного “взрослее”: данные, логика и UI перестали быть намертво связаны друг с другом.

### Result Modal

Отдельная история — это модальное окно с результатами.  
Сначала мне казалось, что это будет простая часть: закончил тренажёр, открыл модалку, показал score. На практике всё оказалось сложнее.

Нужно было:

- правильно поймать момент завершения
- не потерять состояние
- показать корректный результат
- заблокировать фон
- не сломать layout
- сделать так, чтобы модалка ощущалась как реальный финал сценария
- дать пользователю понятный следующий шаг: retry или next level

Я несколько раз переделывала этот компонент. На ранних версиях он либо странно выглядел, либо вообще не давал ощущения завершения. В итоге получилось именно так, как мне хотелось: как в играх — прошёл, получил результат, увидел прогресс и понял, что делать дальше.

### Анимации, звук и общая “живость”

Мне очень понравилось добавлять в проект “живые” детали — звук и анимации.

Я добавила:

- звуковой отклик интерфейса
- глобальный sound handling
- конфетти в result modal
- анимации появления и завершения
- более игровую обратную связь

Это, казалось бы, мелочи, но они очень сильно меняют ощущение от продукта. Интерфейс перестаёт быть просто рабочим и становится приятным, отзывчивым и более “живым”. В какой-то момент я даже подумала, что проект получился очень милым — как маленький котёнок, с которым приятно взаимодействовать.

### Настройки

Настройки тоже выросли гораздо сильнее, чем я ожидала в начале.

Сначала это была просто страница, но со временем я превратила её в полноценный user flow, куда вошли:

- редактирование профиля
- смена пароля
- переключение темы
- переключение языка
- управление звуком
- reset настроек

Мне было важно, чтобы это не выглядело как набор случайных форм. Поэтому я разделила UI и бизнес-логику через кастомные hooks, а сами пользовательские настройки вынесла в отдельный store.

Особенно важной для меня была тема. Не хотелось, чтобы theme switcher просто менял фон. Хотелось, чтобы тема реально влияла на всё приложение и ощущалась как часть общего UX.

### Командная работа

Наверное, самой сложной частью проекта был даже не код, а работа в команде.  
Серьёзно — намного легче сидеть и делать всё одной, потому что ты понимаешь, как думаешь сама. А в команде у каждого:

- свой стиль
- свои идеи
- своё видение
- свой подход

И иногда это реально сталкивается. Нужно договариваться, где-то уступать, где-то объяснять свою позицию. Не обошлось и без конфликтов, но именно это и дало мне очень полезный опыт. Я начала совсем по-другому смотреть на разработку — не как на набор отдельных задач, а как на совместную сборку одного продукта.

### AI и обучение по ходу проекта

Очень часто я обращалась за помощью к AI. Для меня это было не “сделай вместо меня”, а скорее опора: быстрее разобраться, понять направление, снять ступор, сравнить варианты решения.

В итоге я намного лучше разобралась в:

- Next.js
- App Router
- работе с состоянием
- разделении логики и UI
- организации кода
- построении фичи целиком, а не кусками

### Итог

Если смотреть на проект сейчас, для меня это уже не просто набор страниц.  
Это уже цельное приложение, в котором есть:

- структура
- логика
- состояние
- UI
- взаимодействие между частями
- полноценные пользовательские сценарии

Конечно, ещё есть что улучшать:

- местами почистить стили
- где-то упростить код
- кое-где аккуратнее довести архитектуру

Но в целом я правда довольна результатом.

Самое важное, что дал мне этот проект, — это ощущение, что я могу не просто писать компоненты, а **строить полноценные фичи**.

И да… он правда получился как маленький милый котёнок)

---
##  Личные Feature Component

### Feature Component #1 — Practice System

**Тип:** Complex Component

Это моя самая сильная и самая объёмная часть проекта.  
Я реализовала полноценную систему тренажёров с несколькими типами заданий, уровнями сложности, логикой прохождения, подсчётом результата и сохранением прогресса.

#### Что реализовано:

- уровни сложности `easy / medium / hard`
- три типа заданий:
    - `quiz`
    - `code-completion`
    - `code-editor`
- выбор темы и сложности
- общий flow прохождения
- `PracticeTaskLayout`
- `PracticeResultModal`
- scoring / earned points
- progress logic
- next level navigation
- JSON data integration
- local progress persistence

#### Что было сложным и какие проблемы я решала:

- нужно было продумать не отдельный экран, а целый пользовательский сценарий
- нужно было типизировать разные типы заданий так, чтобы UI понимал, какой компонент запускать
- нужно было сделать result flow действительно понятным и игровым
- нужно было уйти от жёсткого хардкода и отделить данные от UI
- пришлось несколько раз пересобирать architecture practice-модуля, чтобы логика, данные и интерфейс были разделены чище

---

### Feature Component #2 — Settings System

**Тип:** Rich UI Screen

Это полноценный экран с несколькими связанными сценариями: профиль, пароль, тема, язык, звук и пользовательские настройки.

#### Что реализовано:

- `SettingsProfileForm`
- `SettingsPasswordForm`
- `SettingsPreferencesForm`
- редактирование имени и email
- смена пароля
- переключение темы
- переключение языка
- sound toggle
- reset settings
- разделение UI и логики через:
    - `useProfileForm`
    - `usePasswordForm`
    - `usePreferencesForm`
- session update после сохранения профиля
- global settings store

#### Что было сложным и какие проблемы я решала:

- нужно было не просто отрисовать формы, а синхронизировать локальное состояние, session и persistent settings
- важно было не собрать всё в одном компоненте, поэтому пришлось аккуратно делить логику по hooks
- нужно было добиться того, чтобы тема и язык реально влияли на приложение целиком
- отдельно пришлось продумывать UX: edit mode, cancel flow, notice states, mounted state, reset flow

---

### Feature Component #3 — Auth Flow

**Тип:** Rich UI Screen

Это система авторизации и регистрации, с которой начинается весь пользовательский путь.

#### Что реализовано:

- login page
- register page
- OAuth login
- credentials login
- protected route logic
- server-side redirect flow
- auth integration через NextAuth
- связка auth pages с dashboard и settings
- mock mode / backend mode
- улучшения welcome / auth controls

#### Что было сложным и какие проблемы я решала:

- нужно было организовать auth как систему, а не просто две формы
- было важно корректно развести публичные и приватные экраны
- нужно было собрать единый auth flow для credentials, OAuth и session
- важно было встроить auth в общую архитектуру приложения, а не оставить его изолированным

---

## Таблица фич

| Категория | Фича | Баллы | PR |
|---|---|---:|---|
| My Components | **Complex Component** — Practice System: интерактивные тренажёры `QuizWidget`, `CodeCompletionWidget`, `CodeEditorWidget`, общий `PracticeTaskLayout`, `PracticeResultModal`, логика прохождения, уровни сложности, подсчёт очков и результатов | +25 | [#50](https://github.com/AnnStarrySky/tandem/issues/50), [#51](https://github.com/AnnStarrySky/tandem/issues/51), [#69](https://github.com/AnnStarrySky/tandem/issues/69), [#75](https://github.com/AnnStarrySky/tandem/issues/75), [#76](https://github.com/AnnStarrySky/tandem/issues/76) |
| My Components | **Complex Component** — Settings System: профиль, пароль, preferences, разделение логики и UI, синхронизация session и local settings | +25 | [#44](https://github.com/AnnStarrySky/tandem/issues/44), [#46](https://github.com/AnnStarrySky/tandem/issues/46), [#47](https://github.com/AnnStarrySky/tandem/issues/47), [#72](https://github.com/AnnStarrySky/tandem/issues/72) |
| My Components | **Rich UI Screen** — Practice Flow: `/practice`, `/practice/[topicId]`, `/practice/[topicId]/[difficulty]`, выбор темы, сложности, прохождение задания, loading / not found / progress flow | +20 | [#50](https://github.com/AnnStarrySky/tandem/issues/50), [#51](https://github.com/AnnStarrySky/tandem/issues/51), [#69](https://github.com/AnnStarrySky/tandem/issues/69), [#73](https://github.com/AnnStarrySky/tandem/issues/73) |
| My Components | **Rich UI Screen** — Auth Flow: login / register / protected pages / OAuth / redirect logic / welcome screen improvements | +20 | [#14](https://github.com/AnnStarrySky/tandem/issues/14), [#16](https://github.com/AnnStarrySky/tandem/issues/16), [#31](https://github.com/AnnStarrySky/tandem/issues/31), [#32](https://github.com/AnnStarrySky/tandem/issues/32), [#33](https://github.com/AnnStarrySky/tandem/issues/33), [#34](https://github.com/AnnStarrySky/tandem/issues/34), [#35](https://github.com/AnnStarrySky/tandem/issues/35), [#48](https://github.com/AnnStarrySky/tandem/issues/48) |
| UI & Interaction | **Code Editor** — интеграция Monaco Editor в тренажёр кода | +15 | [#51](https://github.com/AnnStarrySky/tandem/issues/51) |
| UI & Interaction | **Advanced Animations** — анимации result modal, feedback states, confetti, motion transitions | +10 | [#76](https://github.com/AnnStarrySky/tandem/issues/76) |
| UI & Interaction | **Theme Switcher** — light / dark theme через CSS variables, ThemeProvider, ThemeToggle, интеграция в settings и auth screens | +10 | [#71](https://github.com/AnnStarrySky/tandem/issues/71), [#44](https://github.com/AnnStarrySky/tandem/issues/44) |
| UI & Interaction | **i18n** — переключение языка, locale-aware navigation, интеграция переводов в моих компонентах | +10 | [#48](https://github.com/AnnStarrySky/tandem/issues/48), [#44](https://github.com/AnnStarrySky/tandem/issues/44), [#50](https://github.com/AnnStarrySky/tandem/issues/50) |
| UI & Interaction | **Responsive** — адаптация auth, trainer и settings экранов под разные размеры | +5 | [#73](https://github.com/AnnStarrySky/tandem/issues/73), [#48](https://github.com/AnnStarrySky/tandem/issues/48) |
| UI & Interaction | **Audio API** — звуковой отклик интерфейса, глобальный sound provider, sound toggle | +5 | [#70](https://github.com/AnnStarrySky/tandem/issues/70) |
| Architecture | **State Manager** — глобальный store пользовательских настроек через `useSyncExternalStore`, persistence и cross-tab sync | +10 | [#44](https://github.com/AnnStarrySky/tandem/issues/44), [#70](https://github.com/AnnStarrySky/tandem/issues/70), [#71](https://github.com/AnnStarrySky/tandem/issues/71) |
| Architecture | **Design Patterns** — разделение на `app / entities / features / widgets / shared`, discriminated unions, separation of concerns, custom hooks, facade/public API | +10 | [#75](https://github.com/AnnStarrySky/tandem/issues/75) |
| Architecture | **API Layer** — выделенный слой работы с данными и auth routes, изоляция UI от API / mock mode | +10 | [#32](https://github.com/AnnStarrySky/tandem/issues/32), [#35](https://github.com/AnnStarrySky/tandem/issues/35), [#46](https://github.com/AnnStarrySky/tandem/issues/46), [#47](https://github.com/AnnStarrySky/tandem/issues/47), [#75](https://github.com/AnnStarrySky/tandem/issues/75) |
| Frameworks | **React** | +5 | — |
| Frameworks | **Meta-Framework** — Next.js App Router | +10 | [#31](https://github.com/AnnStarrySky/tandem/issues/31), [#32](https://github.com/AnnStarrySky/tandem/issues/32), [#34](https://github.com/AnnStarrySky/tandem/issues/34), [#35](https://github.com/AnnStarrySky/tandem/issues/35) |

**Итого:** **190 баллов**

