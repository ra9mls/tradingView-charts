# Примеры для тестирования / Test Examples

## Рабочие примеры запросов / Working Query Examples

### Пример 1: cbBTC - 1 Hour Candles

```
Token Address: cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij
Endpoint: Sandbox
Interval: 1H
From: 2025-10-14 00:00
To: 2025-10-15 00:00
```

**Ожидаемый результат:** ~24 свечи с ценами cbBTC

---

### Пример 2: SOL - Daily Candles

```
Token Address: So11111111111111111111111111111111111111112
Endpoint: Sandbox
Interval: 1D
From: 2025-10-01 00:00
To: 2025-10-15 00:00
```

**Ожидаемый результат:** ~14 дневных свечей SOL

---

### Пример 3: USDC - 5 Minute Candles

```
Token Address: EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v
Endpoint: Sandbox
Interval: 5M
From: 2025-10-14 18:00
To: 2025-10-14 20:00
```

**Ожидаемый результат:** 24 пятиминутных свечи USDC

---

## Популярные токены Solana / Popular Solana Tokens

### Top Tokens для тестирования:

| Токен | Адрес Mint | Описание |
|-------|-----------|----------|
| **SOL** | `So11111111111111111111111111111111111111112` | Native Solana |
| **USDC** | `EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v` | USD Coin |
| **USDT** | `Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB` | Tether USD |
| **cbBTC** | `cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij` | Coinbase BTC |
| **JUP** | `JUPyiwrYJFskUPiHa7hkeR8VUtAeFoSYbKedZNsDvCN` | Jupiter |
| **RAY** | `4k3Dyjzvzp8eMZWUXbBCjEvwSkkk59S5iCNLY3QrkX6R` | Raydium |

---

## Тестовые сценарии / Test Scenarios

### Сценарий 1: Быстрая проверка

**Цель:** Проверить базовую работоспособность

```
1. Откройте приложение
2. Оставьте параметры по умолчанию
3. Нажмите "Execute"
4. Ожидайте 2-3 секунды
5. График должен появиться с зелеными/красными свечами
```

---

### Сценарий 2: Разные интервалы

**Цель:** Проверить все варианты интервалов

```
Token: cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij
From: 2025-10-14 00:00
To: 2025-10-15 00:00

Тест для каждого интервала:
- 1M: ожидается ~1440 свечей
- 5M: ожидается ~288 свечей
- 1H: ожидается ~24 свечи
- 4H: ожидается ~6 свечей
- 6H: ожидается ~4 свечи
- 1D: ожидается ~1 свеча
- 3D: ожидается ~0-1 свеча
- 1W: ожидается 0 свечей (диапазон слишком мал)
```

---

### Сценарий 3: Разные эндпоинты

**Цель:** Сравнить данные Sandbox vs Staging

```
Запрос 1 (Sandbox):
Token: So11111111111111111111111111111111111111112
Endpoint: Sandbox
Interval: 1H
From: 2025-10-14 00:00
To: 2025-10-15 00:00

Запрос 2 (Staging):
Token: So11111111111111111111111111111111111111112
Endpoint: Staging
Interval: 1H
From: 2025-10-14 00:00
To: 2025-10-15 00:00

Сравните результаты:
- Количество свечей
- Значения цен
- Время ответа
```

---

### Сценарий 4: Большой диапазон данных

**Цель:** Проверить производительность с большим объемом

```
Token: So11111111111111111111111111111111111111112
Endpoint: Sandbox
Interval: 1M
From: 2025-10-10 00:00
To: 2025-10-15 00:00

Ожидается:
- ~7200 минутных свечей (5 дней × 1440 минут)
- Время загрузки: 5-10 секунд
- График может быть медленнее при взаимодействии
```

---

## Проверка ошибок / Error Testing

### Тест 1: Пустой адрес токена

```
Token Address: [пустое поле]
Click Execute

Ожидается: "Please enter a valid token address"
```

---

### Тест 2: Неправильный порядок дат

```
From: 2025-10-15 00:00
To: 2025-10-14 00:00
Click Execute

Ожидается: "From date must be before To date"
```

---

### Тест 3: Неправильный адрес токена

```
Token: invalid_address_123
Click Execute

Ожидается: API error или "No data available"
```

---

### Тест 4: Будущие даты

```
From: 2026-01-01 00:00
To: 2026-01-02 00:00
Click Execute

Ожидается: "No data available for the selected parameters"
```

---

## Интерактивность графика / Chart Interaction Tests

### Панорамирование (Pan)

```
1. Загрузите любой график
2. Кликните и удерживайте левую кнопку мыши
3. Двигайте мышь влево-вправо
4. Ожидается: график плавно двигается
```

---

### Зум (Zoom)

```
1. Загрузите любой график
2. Прокрутите колесико мыши вверх (zoom in)
3. Прокрутите колесико мыши вниз (zoom out)
4. Ожидается: масштаб графика изменяется
```

---

### Crosshair (Перекрестие)

```
1. Загрузите любой график
2. Наведите курсор на свечу
3. Ожидается:
   - Вертикальная линия показывает время
   - Горизонтальная линия показывает цену
   - Отображается tooltip с данными
```

---

## GraphQL запрос (прямой тест) / Direct GraphQL Test

Для тестирования API напрямую:

```bash
curl -X POST https://gcp-sandbox-gateway.rift.ai/graphql/api \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query TokenPriceData($input: PriceHistoryCandlesInput!) { performance { priceHistoryCandles(input: $input) { tokenPriceData { timestamp closeUSD openUSD highUSD lowUSD isFinal __typename } __typename } __typename } }",
    "variables": {
      "input": {
        "mint": "cbbtcf3aa214zXHbiAZQwf4122FBYbraNdFqgw4iMij",
        "chain": "SOLANA",
        "interval": "INTERVAL_1H",
        "from": "2025-10-14T00:00:00.000Z",
        "to": "2025-10-15T00:00:00.000Z"
      }
    }
  }'
```

**Ожидаемый ответ:**
```json
{
  "data": {
    "performance": {
      "priceHistoryCandles": {
        "tokenPriceData": [
          {
            "timestamp": "2025-10-14T00:00:00.000Z",
            "closeUSD": 45000.50,
            "openUSD": 44800.20,
            "highUSD": 45100.00,
            "lowUSD": 44750.00,
            "isFinal": true,
            "__typename": "TokenPriceCandle"
          },
          ...
        ],
        "__typename": "PriceHistoryCandles"
      },
      "__typename": "Performance"
    }
  }
}
```

---

## Чек-лист для QA / QA Checklist

### Функциональность

- [ ] Форма отображается корректно
- [ ] Все поля ввода работают
- [ ] Селекторы (Interval, Endpoint) работают
- [ ] Date picker работает
- [ ] Кнопка Execute активируется/деактивируется правильно
- [ ] Loading состояние отображается
- [ ] График загружается с корректными данными
- [ ] Количество свечей отображается правильно
- [ ] Ошибки отображаются понятно

### Производительность

- [ ] Загрузка < 3 секунд для стандартного запроса
- [ ] График отзывчивый при взаимодействии
- [ ] Нет утечек памяти (проверить через DevTools)
- [ ] Повторные запросы работают без перезагрузки

### Совместимость

- [ ] Chrome (desktop)
- [ ] Firefox (desktop)
- [ ] Safari (desktop)
- [ ] Edge (desktop)
- [ ] Chrome (mobile)
- [ ] Safari (mobile)

### Responsive Design

- [ ] Desktop (1920×1080)
- [ ] Laptop (1366×768)
- [ ] Tablet (768×1024)
- [ ] Mobile (375×667)

---

## Ожидаемое поведение / Expected Behavior

### При успешной загрузке:

1. ✅ Кнопка показывает "Loading..."
2. ✅ Через 1-3 секунды появляется график
3. ✅ График содержит зеленые (рост) и красные (падение) свечи
4. ✅ Отображается количество свечей
5. ✅ График интерактивен (pan, zoom)
6. ✅ Нет ошибок в консоли

### При ошибке:

1. ✅ Красное сообщение об ошибке под кнопкой
2. ✅ Описание проблемы понятным языком
3. ✅ График не отображается / очищается
4. ✅ Детали ошибки в консоли браузера

---

## Метрики производительности / Performance Metrics

### Целевые показатели:

- **API Response Time:** < 2 секунды
- **Chart Render Time:** < 1 секунда
- **Total Load Time:** < 3 секунд
- **Memory Usage:** < 100 MB
- **Bundle Size:** ~167 KB (First Load JS)

### Измерение:

```javascript
// В консоли браузера
performance.measure('chart-load');
console.table(performance.getEntriesByType('measure'));
```

---

## Частые вопросы / FAQ

**Q: Почему график пустой?**
A: Проверьте консоль на ошибки, убедитесь что данные загружены

**Q: Почему так долго загружается?**
A: Большой диапазон дат или маленький интервал → много данных

**Q: Можно ли экспортировать данные?**
A: В текущей версии нет, это feature request

**Q: Поддерживаются ли другие блокчейны?**
A: Нет, только Solana (захардкожено)

---

**Создано:** 2025-10-16
**Версия:** 1.0
