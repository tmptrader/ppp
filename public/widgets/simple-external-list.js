/** @decorator */

// Колонки
export const DEFAULT_COLUMNS = [
  { source: 'symbol', name: 'Тикер' },
  { source: 'formattedValue', name: 'Цена', valueKey: 'price', highlightChanges: true },
  { source: 'formattedValue', name: 'Объём', valueKey: 'volume' }
];

// Источник данных
export class SimpleTestSource {
  constructor(widget) {
    this.widget = widget;
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'NVDA'];

    this.timer = setInterval(() => {
      widget.appendRow({
        symbol: symbols[Math.random() * symbols.length | 0],
        values: {
          price: +(Math.random() * 300 + 50).toFixed(2),
          volume: Math.floor(Math.random() * 10_000)
        }
      });
    }, 1_000);
  }
  dispose() {
    clearInterval(this.timer);
  }
}

// Манифест
export default {
  listSourceType: SimpleTestSource,
  defaultColumns: DEFAULT_COLUMNS,
  displayName: '⚡ Random Ticker Demo'
};

