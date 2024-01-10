import { LitElement, html, css, nothing } from "lit";

/** Fluent UI System Icons arrow-clockwise-24-regular */
const refreshing = html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
>
    <path
        fill="currentColor"
        d="M12 4.5a7.5 7.5 0 1 0 7.419 6.392c-.067-.454.265-.892.724-.892c.37 0 .696.256.752.623A9 9 0 1 1 18 5.292V4.25a.75.75 0 0 1 1.5 0v3a.75.75 0 0 1-.75.75h-3a.75.75 0 0 1 0-1.5h1.35a7.474 7.474 0 0 0-5.1-2"
    />
</svg>`;
/** Fluent UI System Icons checkmark-24-regular */
const checkmark = html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
>
    <path
        fill="currentColor"
        d="M4.53 12.97a.75.75 0 0 0-1.06 1.06l4.5 4.5a.75.75 0 0 0 1.06 0l11-11a.75.75 0 0 0-1.06-1.06L8.5 16.94z"
    />
</svg>`;
/** Fluent UI System Icons dismiss-24-regular */
const cross = html`<svg
    xmlns="http://www.w3.org/2000/svg"
    width="24"
    height="24"
    viewBox="0 0 24 24"
>
    <path
        fill="currentColor"
        d="m4.397 4.554l.073-.084a.75.75 0 0 1 .976-.073l.084.073L12 10.939l6.47-6.47a.75.75 0 1 1 1.06 1.061L13.061 12l6.47 6.47a.75.75 0 0 1 .072.976l-.073.084a.75.75 0 0 1-.976.073l-.084-.073L12 13.061l-6.47 6.47a.75.75 0 0 1-1.06-1.061L10.939 12l-6.47-6.47a.75.75 0 0 1-.072-.976l.073-.084z"
    />
</svg>`;
export class Button extends LitElement {
    static properties = {
        command: { type: Function },
        status: { state: true },
    };
    constructor() {
        super();
        this.command = null;
        /**@type {"standby"|"firing"|"success"|"failed"} */
        this.status = "standby";
        this.iconmap = {
            standby: null,
            firing: refreshing,
            success: checkmark,
            failed: cross,
        };
    }
    static styles = css`
        :host {
            background-color: var(--color-background-2);
            cursor: pointer;
            display: inline-flex;
            transition: 0.2s ease-out;
        }
        :host(:hover) {
            background-color: var(--color-background-2-highlight);
        }
        button {
            background: none;
            border: none;
            padding: 0.5em 1em;
            cursor: inherit;
            vertical-align: middle;
            user-select: none;
            display: grid;
            justify-items: center;
            align-items: center;
        }
        button > * {
            grid-area: 1/1;
        }
        .btn-indicator {
            width: 1em;
            height: 1em;
        }
        .btn-indicator svg {
            width: 100%;
            height: 100%;
        }
        .btn-indicator + div {
            visibility: hidden;
        }
        :host([status="failed"]) .btn-indicator {
            color: var(--color-red-1);
        }
        :host([status="success"]) .btn-indicator {
            color: var(--color-green-1);
        }
    `;
    _indicator() {
        if (this.status === "standby") {
            return nothing;
        }
        return html`<div class="btn-indicator">
            ${this.iconmap[this.status]}
        </div>`;
    }
    render() {
        this.shadowRoot.host.setAttribute("status", this.status);
        if (this.status === "success" || this.status === "failed") {
            setTimeout(() => {
                this.status = "standby";
            }, 1000);
        }

        return html`
            <button @click=${this._doCommand}>
                ${this._indicator()}
                <div>
                    <slot></slot>
                </div>
            </button>
        `;
    }
    _doCommand() {
        if (this.command) {
            try {
                const r = this.command();
                if (r instanceof Promise) {
                    this.status = "firing";
                    r.then(() => {
                        this.status = "success";
                    }).catch((error) => {
                        console.log(error);
                        this.status = "failed";
                    });
                    return;
                }
                this.status = "success";
            } catch (error) {
                console.log(error);
                this.status = "failed";
            }
        }
    }
}

customElements.define("c-button", Button);
