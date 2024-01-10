import { LitElement, html, css } from "lit";
import { msg, updateWhenLocaleChanges } from "@lit/localize";

export class Textfield extends LitElement {
    static properties = {
        name: {},
        value: {},
        placeholder: {},
        disabled: { type: Boolean, reflect: true },
        label: {},
    };
    constructor() {
        super();
        updateWhenLocaleChanges(this);
        this.name = undefined;
        this.value = null;
        this.placeholder = null;
        this.disabled = false;
        this.label = "";
    }

    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            font-size: medium;
        }
        .head {
            display: flex;
            justify-content: space-between;
            font-weight: bold;
            font-size: 1.15em;
            align-items: baseline;
        }
    `;

    render() {
        return html`
            <div>
                <div class="head">
                    <label for="textfield">${this.label}</label>
                    <input
                        type="text"
                        id="textfield"
                        name=${this.name}
                        value=${this.value}
                        placeholder=${this.placeholder ??
                        msg("type something here")}
                        ?disabled=${this.disabled}
                    />
                </div>
            </div>
        `;
    }
}

customElements.define("c-textfield", Textfield);
