/** @decorator */

import ppp from '../../ppp.js';
import { widgetStyles, Widget } from '../widget.js';
import { html, css, observable } from '../../vendor/fast-element.min.js';
import { WIDGET_TYPES } from '../../lib/const.js';
import { formatDateWithOptions } from '../../lib/intl.js';
import { normalize } from '../../design/styles.js';
import '../button.js';
import '../checkbox.js';
import '../radio-group.js';
import '../text-field.js';
import '../widget-controls.js';

export const arbitrationWidgetTemplate = html`
  <template ensemble="disabled">
    <div class="widget-root">
      <div class="widget-header">
        <div class="widget-header-inner">
          <span class="widget-title">
            <span class="title">
              ${(x) =>
                x.document?.displayTimeInHeader ?? true
                  ? x.time
                  : x.document?.name}
            </span>
          </span>
          <ppp-widget-header-buttons
            ensemble="disabled"
          ></ppp-widget-header-buttons>
        </div>
      </div>
      <div class="widget-body"></div>
      <ppp-widget-resize-controls
        :ignoredHandles="${(x) => ['top', 'bottom', 'ne', 'se', 'nw', 'sw']}"
      ></ppp-widget-resize-controls>
    </div>
  </template>
`;

export const arbitrationWidgetStyles = css`
  ${normalize()}
  ${widgetStyles()}

  .widget-header::after {
    border-bottom: none;
  }
`;

export class ArbitrationWidget extends Widget {
  @observable
  time;

  options;

  constructor() {
    super();

    this.rafLoop = this.rafLoop.bind(this);
  }

  rafLoop() {
    if (this.$fastController.isConnected) {
      this.time = formatDateWithOptions(new Date(), this.options);
    }
  }

  connectedCallback() {
    super.connectedCallback();
    ppp.app.rafEnqueue(this.rafLoop);
  }

  disconnectedCallback() {
    ppp.app.rafDequeue(this.rafLoop);
    super.disconnectedCallback();
  }

  async validate() {}

  async submit() {
    return {
      $set: {
        displayTimeInHeader: this.container.displayTimeInHeader.checked,
        headerTimeFormat: this.container.headerTimeFormat.value
      }
    };
  }
}

export async function widgetDefinition() {
  return {
    type: WIDGET_TYPES.ARBITRATION,
    collection: 'PPP',
    title: html`Арбитраж`,
    description: html`Виджет <span class="positive">Арбитраж</span> служит для
      отображения расхождения цены на различных биржах.`,
    customElement: ArbitrationWidget.compose({
      template: clockWidgetTemplate,
      styles: clockWidgetStyles
    }).define(),
    minWidth: 115,
    minHeight: 32,
    defaultWidth: 150,
    settings: html`
      <div class="widget-settings-section">
      </div>
    `
  };
}
