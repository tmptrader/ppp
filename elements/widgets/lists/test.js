export async function listDefinition() {
    return {
      pagination: false,
      defaultColumns: [
        { source: 'name', name: 'Имя' },
        { source: 'value', name: 'Значение' }
      ],
      control: class {
        connectedCallback(widget) {
          const rows = [
            { name: 'Тестовая строка 1', value: 123 },
            { name: 'Тестовая строка 2', value: 456 },
            { name: 'Тестовая строка 3', value: 789 }
          ];
  
          rows.forEach((row, index) => {
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
  