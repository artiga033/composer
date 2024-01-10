import { LitElement, html, css, nothing } from "lit";
import { msg, updateWhenLocaleChanges } from "@lit/localize";

export class Textarea extends LitElement {
    static properties = {
        name: {},
        value: {},
        placeholder: {},
        disabled: { type: Boolean, reflect: true },
        label: {},
        codeblock: { type: Boolean, reflect: true },
        copy: { type: Boolean, reflect: true },
    };
    constructor() {
        super();
        updateWhenLocaleChanges(this);
        this.name = undefined;
        this.value = null;
        this.placeholder = null;
        this.disabled = false;
        /**@description The label to display for the textarea input */
        /**@type {string} */
        this.label = "";
        this.codeblock = false;
        /**Display a button allowing copy. */
        this.copy = false;
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
        .head > .commands {
            display: flex;
            justify-content: flex-start;
        }
        textarea {
            border: 1px solid var(--color-theme-1);
            border-left: 0.25em solid var(--color-decor-3);
            resize: none;
            font-size: 1em;
            font-family: inherit;
            background-color: var(--color-background-1);
            transition: 0.2s ease-out;
            height: 100%;
        }
        textarea[disabled] {
            background-color: var(--color-background-1-overshadow);
            border-left-color: var(--color-decor-3);
            cursor: text;
        }
        :host([codeblock]) textarea {
            font-family: "Noto Sans Mono", "Roboto Mono", "Monaco", consolas,
                Menlo, "Cascadia Mono", monospace,
                "Microsoft YaHei" "PingFang SC";
        }
        textarea:focus {
            outline: none;
            border-color: transparent;
            box-shadow: 0.05em 0.05em 0.35em 0.05em var(--color-theme-1);
        }
        label {
            color: var(--color-text-1);
            border-left: 0.5rem solid var(--color-decor-1);
            padding-left: 0.5rem;
        }
    `;
    _handleChange(e) {
        this.value = e.target.value;
        this.dispatchEvent(
            new CustomEvent("change", { detail: { value: this.value } })
        );
    }
    _label() {
        if (this.label?.length !== 0) {
            return html`<label for="input"> ${this.label} </label>`;
        }
    }
    _copyBtn() {
        const copyAction = () => {
            navigator.clipboard.writeText(this.value);
        };
        if (this.copy) {
            return html`<c-button class="copy" .command=${copyAction}
                >${msg("Copy")}</c-button
            >`;
        }
    }
    render() {
        return html`
            <div class="head">
                ${this._label()}
                <div class="commands">${this._copyBtn()}</div>
            </div>
            <textarea
                name=${this.name ?? nothing}
                .value=${this.value}
                placeholder=${this.placeholder ?? msg("type something here")}
                ?disabled=${this.disabled}
                @change=${this._handleChange}
                rows="${this.rows ?? nothing}"
                cols=${this.cols ?? nothing}
                id="input"
            >
            </textarea>
        `;
    }
}

customElements.define("c-textarea", Textarea);
