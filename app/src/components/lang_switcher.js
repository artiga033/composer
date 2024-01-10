import { msg, updateWhenLocaleChanges } from "@lit/localize";
import { LitElement, html, css } from "lit";
import { allLocales } from "../generated/locale-codes.js";
import localize from "../utils/localize.js";
import "./combobox.js";
export class LangSwitcher extends LitElement {
    static properties = {};
    static styles = css``;
    constructor() {
        super();
        updateWhenLocaleChanges(this);
    }

    render() {
        return html`
            <c-combobox
                @change=${(e) => localize.setLocale(e.target.value)}
                .options=${allLocales}
                .value="${localize.getLocale()}"
                .label=${msg("Language")}
            ></c-combobox>
        `;
    }
}

customElements.define("c-lang-switcher", LangSwitcher);
