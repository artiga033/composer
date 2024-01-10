import { updateWhenLocaleChanges } from "@lit/localize";
import { LitElement, html, css, nothing } from "lit";

export class ToolLink extends LitElement {
    static properties = {
        metadata: { type: Object },
    };
    constructor() {
        super();
        updateWhenLocaleChanges(this);
        /**@type {Metadata} */
        this.metadata = undefined;
    }
    static styles = css`
        a {
            text-decoration: none;
            font-size: 0.8em;
            color: var(--color-text-link-1);
            display: grid;
            grid: minmax(0, 1fr) / minmax(0, 1fr);
            width: 100%;
            height: 100%;
        }
        .container {
            padding: 1em;
            background-color: var(--color-background-1);
            box-shadow: inset 0 0 0.5em 0.15em var(--color-decor-3);
            transition: 0.3s;
        }
        .container:hover {
            box-shadow: inset 0 0 0.5em 0.5em var(--color-decor-2);
        }
        .text {
            display: flex;
            flex-direction: column;
            align-items: flex-start;
            justify-content: center;
        }
        .title {
            font-size: 1.2em;
            font-weight: bold;
        }
        .description {
            font-size: 0.8em;
            color: var(--color-text-link-1-overshadow);
            white-space: nowrap;
            text-overflow: ellipsis;
            max-width: 100%;
            overflow: hidden;
        }
    `;
    render() {
        if (!this.metadata) {
            console.warn("No metadata provided to tool-link");
            return nothing;
        }
        return html`
            <a
                href="tools/${this.metadata.pathName}"
                title=${this.metadata.description}
            >
                <div class="container">
                    <div class="text">
                        <span class="title">${this.metadata.name}</span>
                        <span class="description"
                            >${this.metadata.description}</span
                        >
                    </div>
                </div>
            </a>
        `;
    }
}

customElements.define("c-tool-link", ToolLink);
