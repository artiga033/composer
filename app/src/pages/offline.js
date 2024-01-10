import { LitElement, html } from "lit";

export class OfflinePage extends LitElement {
    render() {
        return html`<h1>Offline</h1>`;
    }
}
customElements.define('offline-page', OfflinePage);