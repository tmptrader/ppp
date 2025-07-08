/** @decorator */

// ─── 1. Колонки ────────────────────────────────────────────────────────
const DEFAULT_COLUMNS = [
  { source: 'symbol',         name: 'Тикер' },
  { source: 'formattedValue', name: 'Цена',  valueKey: 'price',  highlightChanges: true },
  { source: 'formattedValue', name: 'Объём', valueKey: 'volume' }
];

// ─── 2. listDefinition, которое ждёт PPP ───────────────────────────────
export async function listDefinition() {
  return {
    defaultColumns: DEFAULT_COLUMNS,

    // Контроллёр списка
    control: class {
      #timer;

      // PPP вызовет это сразу после создания колонок
      async connectedCallback(widget) {
        const TICKERS = ['AAPL', 'MSFT', 'NVDA', 'GOOGL'];

        this.#timer = setInterval(() => {
          widget.appendRow({
            symbol: TICKERS[Math.random() * TICKERS.length | 0],
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
  };
}
