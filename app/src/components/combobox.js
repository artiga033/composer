import { LitElement, html, nothing } from "lit";

class ComboBox extends LitElement {
    static properties = {
        options: { type: Array },
        label: { type: String },
        value: { type: String },
        name: { type: String },
        onChange: { type: Function },
    };
    constructor() {
        super();
        /**@type {string[]} */
        /** This is to make lit-analyzer (lit-plugin for vscode) to correctly recognize this type as string[]
         *   instead of nerver[], because it does not actually read type info from jsdoc.
         * Though slight performance hit, it is better to keep this for a nice type checking.
         */
        this.options = [""].slice(0, 0);
        this.label = "";
        this.name = null;
        this.value = null;
    }

    handleChange(e) {
        this.value = e.target.value;
        this.dispatchEvent(new Event("change"));
    }

    render() {
        const options = this.options.map((option) => {
            return html`<option value=${option}>${option}</option>`;
        });
        return html`
            <label for="s">${this.label}</label>
            <select
                id="s"
                name=${this.name ?? nothing}
                .value=${this.value}
                @change=${this.handleChange}
            >
                ${options}
            </select>
        `;
    }
    firstUpdated() {
        this.value = this.shadowRoot.querySelector("select").value;
    }
}

customElements.define("c-combobox", ComboBox);
