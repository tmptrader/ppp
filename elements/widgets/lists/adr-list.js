export async function listDefinition() {
  return {
    pagination: false,
    defaultColumns: [
      { source: 'symbol', name: 'Тикер' },
      { source: 'traderId', name: 'Трейдер' }
    ],
    control: class {
      connectedCallback(widget) {
        const rows = [
          { symbol: 'BABA', traderId: 'demo1', index: 0 },
          { symbol: 'JD', traderId: 'demo2', index: 1 }
        ];

        rows.forEach((row) => widget.appendRow(row));
      }

      removeRow(index, widget) {
        widget.document.listSource = widget.document.listSource.filter(
          (r) => r.index !== index
        );
      }
    },
    validate: async () => {},
    submit: async (widget) => ({
      listSource: widget.document.listSource
    })
  };
}
