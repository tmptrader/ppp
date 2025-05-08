export async function listDefinition() {
  return {
    pagination: false,
    defaultColumns: [
      { source: 'adr', name: 'ADR' },
      { source: 'hk', name: 'HK' },
      { source: 'diffPercent', name: '% разницы' }
    ],
    control: class {
      connectedCallback(widget) {
        const data = [
          { adr: 'BABA', hk: '9988.HK', diffPercent: '+2.4%' },
          { adr: 'JD', hk: '9618.HK', diffPercent: '-1.1%' },
          { adr: 'NTES', hk: '9999.HK', diffPercent: '+0.7%' }
        ];

        data.forEach((row, index) => {
          row.index = index;
          widget.appendRow(row);
        });
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
