import { LitElement, css, html } from "lit";

class Header extends LitElement {
    static properties = {
        title: { type: String },
        subtitle: { type: String },
    };
    static styles = css`
        :host {
            display: flex;
            flex-direction: column;
            align-items: center;
        }
        #logo {
            font-family: "Stelpolvo Sans", sans-serif;
            font-size: 2.5rem;
            font-weight: bold;
            color: var(--color-theme-1);
        }
        a:any-link{
            text-decoration: none;
            color: inherit;
        }
        hr {
            width: 33%;
            border: 0;
            height: 1px;
            opacity: 0.8;
            background: repeating-linear-gradient(to right, var(--color-theme-1), var(--color-theme-1-highlight) 15%,var(--color-theme-1) 30%);
            filter: blur(1px);
        }
    `;
    commands() {
        return html` <div></div> `;
    }
    logo() {
        return html`<a href="/"> <span id="logo">COMPOSER</span> </a>`;
    }
    render() {
        return html`${this.logo()}${this.commands()}<hr>`;
    }
}

customElements.define("c-header", Header);
