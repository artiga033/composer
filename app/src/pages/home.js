import { LitElement, css, html } from "lit";
import tools_metadata from "virtual:tools-metadata";
import "../components/toollink.js";
import { msg, updateWhenLocaleChanges } from "@lit/localize";

export class HomePage extends LitElement {
    constructor() {
        super();
        updateWhenLocaleChanges(this);
    }
    static styles = css`
        h1 {
            font-size: 2em;
            font-weight: bold;
            text-align: center;
        }
        .tools-wrapper {
            font-size: 1.25rem;
            display: flex;
            flex-direction: row;
            justify-content: space-between;
            flex-wrap: wrap;
        }
        c-tool-link {
            width: 15vw;
            height: 4em;
            overflow: hidden;
        }
        @media screen and (min-width: 1921px){
            .tools-wrapper {
                font-size: 1.5rem;
            }
        }
        @media screen and (max-width: 1520px) {
            .tools-wrapper {
                font-size: 1rem;
            }
            c-tool-link {
                width: 24vw;
                height: 4rem;
            }
        }
        @media screen and (max-width: 767px) {
            .tools-wrapper {
                font-size: 0.8rem;
            }
            c-tool-link {
                width: 47vw;
                height: 3rem;
            }
        }
    `;
    render() {
        const toolLinks = tools_metadata.map(
            (tool) => html`<c-tool-link .metadata=${tool}></c-tool-link>`
        );
        return html`
            <h1>${msg("All Tools")}</h1>
            <div class="tools-wrapper">${toolLinks}</div>
        `;
    }
}

window.customElements.define("home-page", HomePage);
