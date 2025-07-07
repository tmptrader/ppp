/** @decorator */
// Простейший внешний список для PPP-терминала.
// Кладёте этот файл в любое публичное хранилище и указываете URL
// в «Widgets ▸ Lists ▸ External list URL».

// Динамически подтягиваем ядро PPP (rootUrl знает свой origin)
import ppp from `${window.ppp?.rootUrl ?? ''}/ppp.js`;

// Ниже импорт не обязателен для работы, но оставлен как пример,
// если вам понадобится шаблонизатор FAST внутри списка.
// import { html } from `${ppp.rootUrl}/vendor/fast-element.min.js`;

// 1️⃣ Описываем колонки, которые увидит пользователь.
export const DEFAULT_COLUMNS = [
  {
    source: 'symbol',               // штатный рендер символа
    name: 'Тикер'
  },
  {
    source: 'formattedValue',       // отформатированное число
    name: 'Цена',
    valueKey: 'price',
    highlightChanges: true          // зелёный/красный мигание при изменении
  },
  {
    source: 'formattedValue',
    name: 'Объём',
    valueKey: 'volume'
  }
];

// 2️⃣ Источник данных: сюда можно подвесить WebSocket, брокера и т.п.
export class SimpleTestSource {
  /** @type {import('../widget-column-list.js').WidgetColumnList} */
  widget;
  timer;

  constructor(widgetInstance) {
    this.widget = widgetInstance;

    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'NVDA'];

    // Каждую секунду публикуем случайную строчку.
    this.timer = setInterval(() => {
      const row = {
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        values: {
          price: +(Math.random() * 300 + 50).toFixed(2),
          volume: Math.floor(Math.random() * 10000)
        }
      };

      // appendRow автоматически перерисует или обновит строку
      this.widget.appendRow(row);
    }, 1000);
  }

  // Вызывается виджетом при его уничтожении — чистим ресурсы
  dispose() {
    clearInterval(this.timer);
  }
}

// 3️⃣ Реестр — именно этот объект ждёт PPP после dynamic import()
export default {
  listSourceType: SimpleTestSource,
  defaultColumns: DEFAULT_COLUMNS,
  displayName: '⚡ Random Ticker Demo'
};
