/** @decorator */

// 1️⃣ Колонки
export const DEFAULT_COLUMNS = [
  { source: 'symbol', name: 'Тикер' },
  { source: 'formattedValue', name: 'Цена', valueKey: 'price', highlightChanges: true },
  { source: 'formattedValue', name: 'Объём', valueKey: 'volume' }
];

// 2️⃣ Источник данных
export class SimpleTestSource {
  widget;
  timer;

  constructor(widgetInstance) {
    this.widget = widgetInstance;

    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'NVDA'];

    this.timer = setInterval(() => {
      this.widget.appendRow({
        symbol: symbols[Math.floor(Math.random() * symbols.length)],
        values: {
          price: +(Math.random() * 300 + 50).toFixed(2),
          volume: Math.floor(Math.random() * 1e4)
        }
      });
    }, 1_000);
  }

  dispose() {
    clearInterval(this.timer);
  }
}

// 3️⃣ Манифест
export default {
  listSourceType: SimpleTestSource,
  defaultColumns: DEFAULT_COLUMNS,
  displayName: '⚡ Random Ticker Demo'
};
