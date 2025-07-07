/** @decorator */

// 1️⃣  Колонки, которые увидит PPP
const DEFAULT_COLUMNS = [
  { source: 'symbol',         name: 'Тикер' },
  { source: 'formattedValue', name: 'Цена',  valueKey: 'price',  highlightChanges: true },
  { source: 'formattedValue', name: 'Объём', valueKey: 'volume' }
];

// 2️⃣  Экспорт «listDefinition» —- это ровно то, что ищет PPP
export async function listDefinition() {
  return {
    defaultColumns: DEFAULT_COLUMNS,   // обязателен
    pagination:      false,            // можно опустить
    extraControls:   null,
    control: class {
      timer;

      async connectedCallback(widget) {
        // простая демка: каждую секунду добавляем строку
        const tickers = ['AAPL', 'MSFT', 'NVDA', 'GOOGL'];

        this.timer = setInterval(() => {
          widget.appendRow({
            symbol: tickers[Math.random()*tickers.length|0],
            values: {
              price:  +(Math.random()*300 + 50).toFixed(2),
              volume: Math.floor(Math.random()*10_000)
            }
          });
        }, 1000);
      }

      async disconnectedCallback() {
        clearInterval(this.timer);
      }
    }
  };
}
