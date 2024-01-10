import { LitElement, html, css } from "lit";
import { msg,updateWhenLocaleChanges } from "@lit/localize";
import "../../components/textarea.js";
import "../../components/button.js";
import "../../components/combobox.js";
import { Converter } from "../../functionalities/terminal_color_schema_converter.js";

export const name = msg("Terminal Color Schema Converter");
export const description = msg(
    "Converts color schema files of one terminal to another."
);

export class TerminalColorSchemaConverter extends LitElement {
    constructor() {
        super();
        updateWhenLocaleChanges(this);
    }
    static styles = css`
        :host {
            display: flex;
            justify-content: center;
        }
        c-textarea {
            height: 35em;
            width: 100%;
        }
        .opbox {
            width: 100%;
        }
        .btn-wrp {
            display: flex;
            flex-direction: column;
            justify-content: inherit;
            margin: 0 2em;
        }
        @media (max-width: 744px) {
            :host {
                flex-direction: column;
                justify-content: flex-start;
                align-items: center;
            }
            .btn-wrp {
                flex-direction: row;
                margin: 0.75em 0;
            }
            c-textarea {
                height: 20em;
            }
            .opbox {
                width: 90%;
            }
        }
    `;
    _handleConvertButtonClick() {
        const source = this.shadowRoot.getElementById("source").value;
        const destinationEle = this.shadowRoot.getElementById("destination");
        const from = this.shadowRoot.getElementById("from").value;
        const to = this.shadowRoot.getElementById("to").value;
        try {
            const result = Converter.convert(source, from, to);
            destinationEle.value = result;
        } catch (error) {
            destinationEle.value = error;
            throw error;
        }
    }
    options = Object.keys(Converter.converters);
    render() {
        return html`
            <div class="opbox">
                <c-combobox
                    id="from"
                    .label=${msg("From:")}
                    .options=${this.options}
                ></c-combobox>
                <c-textarea
                    id="source"
                    label=${msg("Source Schema")}
                    codeblock
                    copy
                ></c-textarea>
            </div>
            <div class="btn-wrp">
                <c-button .command=${() => this._handleConvertButtonClick()}
                    >${msg("Click To Convert")}</c-button
                >
            </div>
            <div class="opbox">
                <c-combobox
                    id="to"
                    .label=${msg("To:")}
                    .options=${this.options}
                ></c-combobox>
                <c-textarea
                    id="destination"
                    label=${msg("Destination Schema")}
                    disabled
                    codeblock
                    copy
                ></c-textarea>
            </div>
        `;
    }
}

customElements.define(
    "tool-terminal-color-schema-converter",
    TerminalColorSchemaConverter
);
