# Инструкция по сборке APK для macOS (MacBook Pro 2019)

Чтобы превратить этот проект в мобильное приложение (APK), мы будем использовать **Capacitor**.

## 1. Подготовка окружения
Убедитесь, что у вас установлены:
- **Node.js**: `brew install node`
- **Android Studio**: Скачайте с официального сайта.
- **Java (JDK 17)**: `brew install openjdk@17`

## 2. Настройка проекта
В терминале (в корне проекта) выполните:

```bash
# Инициализация npm, если еще не сделана
npm init -y

# Установка Capacitor
npm install @capacitor/core @capacitor/cli @capacitor/android

# Инициализация Capacitor
npx cap init "GTA_Clone" "com.example.gtaclone" --web-dir .

# Добавление платформы Android
npx cap add android
```

## 3. Сборка APK
1. Синхронизируйте файлы:
   ```bash
   npx cap copy
   ```
2. Откройте проект в Android Studio:
   ```bash
   npx cap open android
   ```
3. В Android Studio:
   - Дождитесь завершения индексации Gradle.
   - Перейдите в меню **Build > Build Bundle(s) / APK(s) > Build APK(s)**.
   - После завершения появится уведомление со ссылкой на файл `app-debug.apk`.

## 4. Особенности для вашего MacBook (Intel i7)
Ваш ноутбук мощный, но эмуляторы Android могут нагружать процессор.
- Используйте **Hardware Acceleration** в настройках эмулятора.
- Рекомендуется тестировать на реальном Android-устройстве, подключив его по USB.

---
**Примечание**: Поскольку проект использует Three.js через CDN, для работы APK потребуется подключение к интернету. Для оффлайн-работы следует скачать `three.module.js` и `cannon-es.js` локально в папку `lib/` и обновить пути в `index.html`.
