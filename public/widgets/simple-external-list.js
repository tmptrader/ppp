/** @decorator */
// импорт констант опционален, но удобен
// import { COLUMN_SOURCE } from `${window.ppp.rootUrl}/lib/const.js`;

export const DEFAULT_COLUMNS = [
  { source: 'symbol', name: 'Тикер' },

  // 👇 правильное имя источника!
  { source: 'formatted-value', name: 'Цена',  valueKey: 'price'  },
  { source: 'formatted-value', name: 'Объём', valueKey: 'volume' }
];

export class SimpleTestSource {
  #timer;

  async connectedCallback(widget) {
    const symbols = ['AAPL', 'MSFT', 'GOOGL', 'NVDA'];

    this.#timer = setInterval(() => {
      widget.appendRow({
        symbol: symbols[Math.random() * symbols.length | 0],
        values: {
          price:  +(Math.random() * 300 + 50).toFixed(2),
          volume: Math.floor(Math.random() * 10_000)
        }
      });
    }, 1_000);
  }

  async disconnectedCallback() {
    clearInterval(this.#timer);
  }
}

export async function listDefinition() {
  return {
    defaultColumns: DEFAULT_COLUMNS,
    control: SimpleTestSource
  };
}
