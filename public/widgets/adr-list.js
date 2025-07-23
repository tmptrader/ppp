/** @decorator */

import ppp from '../ppp.js';
import { PPPElement } from '../lib/ppp-element.js';
import {
  attr,
  css,
  html,
  Observable,
  observable,
  ref,
  repeat
} from '../vendor/fast-element.min.js';
import { display } from '../vendor/fast-utilities.js';
import { ellipsis, scrollbars } from '../design/styles.js';
import {
  fontSizeWidget,
  fontWeightWidget,
  lineHeightWidget,
  paletteGrayLight1,
  paletteGrayLight2,
  paletteGrayLight3,
  paletteWhite,
  spacing1,
  spacing2,
  themeConditional
} from '../design/design-tokens.js';

await ppp.i18n(import.meta.url);

// Класс для обработки данных виджета
class MyCustomWidget {
  constructor(widget) {
    this.widget = widget;
    this.data = [];
  }

  // Метод для загрузки данных
  async loadData() {
    try {
      // Здесь можно загрузить данные из внешнего источника
      // Например, через fetch API
      const response = await fetch('https://api.example.com/data');
      this.data = await response.json();
      
      // Обновляем отображение
      this.displayData();
    } catch (error) {
      console.error('Ошибка загрузки данных:', error);
      this.widget.notificationsArea.error({
        text: 'Ошибка загрузки данных',
        keep: true
      });
    }
  }

  // Метод для отображения данных
  displayData() {
    if (this.data && this.data.length > 0) {
      // Очищаем текущие строки таблицы
      while (this.widget.tableBody.firstChild) {
        this.widget.tableBody.removeChild(this.widget.tableBody.firstChild);
      }

      // Добавляем новые строки
      this.data.forEach(item => {
        const tr = document.createElement('div');
        tr.setAttribute('class', 'tr row');
        
        // Создаем ячейки для каждого столбца
        const columns = this.widget.columnsArray || [];
        
        columns.forEach(col => {
          const td = document.createElement('div');
          td.setAttribute('class', 'td cell');
          
          // Заполняем ячейку данными в зависимости от типа столбца
          if (col.valueKey && item[col.valueKey]) {
            td.textContent = item[col.valueKey];
          }
          
          tr.appendChild(td);
        });
        
        this.widget.tableBody.appendChild(tr);
      });
      
      // Уведомляем об обновлении документа
      Observable.notify(this.widget, 'document');
    }
  }

  // Вызывается при подключении виджета
  async connectedCallback(widget) {
    this.widget = widget;
    
    // Загружаем данные при инициализации
    await this.loadData();
    
    // Настраиваем периодическое обновление данных (каждые 60 секунд)
    this.updateInterval = setInterval(() => this.loadData(), 60000);
  }

  // Вызывается при отключении виджета
  async disconnectedCallback() {
    // Очищаем интервал обновления
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
    }
  }
}

// Определение столбцов по умолчанию
const DEFAULT_COLUMNS = [
  {
    source: 'symbol',
    name: 'Символ',
    width: 100
  },
  {
    source: 'formatted-value',
    valueKey: 'price',
    name: 'Цена',
    width: 100
  },
  {
    source: 'formatted-value',
    valueKey: 'change',
    name: 'Изменение',
    width: 100
  }
];

// Экспортируем определение виджета
export async function listDefinition() {
  return {
    extraControls: null,
    pagination: false,
    defaultColumns: DEFAULT_COLUMNS,
    control: class {
      async connectedCallback(widget) {
        widget.customWidget = new MyCustomWidget(widget);
        return widget.customWidget?.connectedCallback(widget);
      }

      async disconnectedCallback(widget) {
        return widget.customWidget?.disconnectedCallback();
      }
    },
    validate: async (widget) => {
      // Здесь можно добавить валидацию настроек виджета
    },
    submit: async (widget) => {
      // Возвращаем настройки виджета для сохранения
      return {
        // Добавьте здесь нужные параметры
        apiUrl: widget.container.apiUrl.value
      };
    },
    settings: html`
      <div class="widget-settings-section">
        <div class="widget-settings-label-group">
          <h5>Настройки API</h5>
          <p class="description">
            Укажите URL для получения данных
          </p>
        </div>
        <div class="widget-settings-input-group">
          <div class="control-line">
            <ppp-text-field
              ${ref('apiUrl')}
              placeholder="https://api.example.com/data"
              value="${(x) => x.document.apiUrl ?? ''}"
            ></ppp-text-field>
          </div>
        </div>
      </div>
      <div class="widget-settings-section">
        <div class="widget-settings-label-group">
          <h5>Столбцы таблицы</h5>
        </div>
        <div class="spacing2"></div>
        <ppp-widget-column-list
          ${ref('columnList')}
          :stencil="${() => {
            return {
              source: 'symbol',
              name: 'Символ'
            };
          }}"
          :list="${(x) => x.document.columns ?? DEFAULT_COLUMNS}"
        ></ppp-widget-column-list>
      </div>
    `
  };
}

