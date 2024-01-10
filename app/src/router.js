import { Router } from "@thepassle/app-tools/router.js";
import { lazy } from "@thepassle/app-tools/router/plugins/lazy.js";
import { offline } from "@thepassle/app-tools/router/plugins/offline.js";
import { resetFocus } from "@thepassle/app-tools/router/plugins/resetFocus.js";
import { scrollToTop } from "@thepassle/app-tools/router/plugins/scrollToTop.js";
import { checkServiceWorkerUpdate } from "@thepassle/app-tools/router/plugins/checkServiceWorkerUpdate.js";
import { LitElement, html } from "lit";
import { msg } from "@lit/localize";
import { unsafeStatic, html as staticHtml } from "lit/static-html.js";
import tools_metadata from "virtual:tools-metadata";

// shadows the type of `msg` to static analysis tool from extracting arguments sent to `msgNoExtract`
/**@type {Function} */
const msgNoExtract = msg;

if (!globalThis.URLPattern) {
    await import("urlpattern-polyfill");
}

/** @param {()=>string} localizer A function that evaluates to the localized title, typically a `msg` call*/
function localizedTitle(localizer) {
    function eventHandler(e) {
        if (e.detail.status == "ready") {
            document.title = localizer();
        }
    }
    return () => {
        addEventListener("lit-localize-status", eventHandler);
        return localizer();
    };
}

const router = new Router({
    /** Plugins to be run for every route */
    plugins: [
        /** Redirects to an offline page */
        offline,
        /** Checks for service worker updates on route navigations */
        checkServiceWorkerUpdate,
        scrollToTop,
        resetFocus,
    ],
    /** Fallback route when the user navigates to a route that doesnt exist */
    fallback: "/404",

    /**@typedef {import('@thepassle/app-tools/types/router/types.js').RouteDefinition} Route*/
    /**@type {Route[]} */
    routes: [
        {
            path: "/",
            title: localizedTitle(() => msg("Home Page") + " - Composer"),
            plugins: [lazy(() => import("./pages/home.js"))],
            render: () => html`<home-page></home-page>`,
        },
        {
            path: "/404",
            plugins: [lazy(() => import("./pages/not_found.js"))],
            title: localizedTitle(() => msg("Not Found") + " - Composer"),
            render: () => html`<not-found-page></not-found-page>`,
        },
        {
            path: "/offline",
            plugins: [lazy(() => import("./pages/offline.js"))],
            title: localizedTitle(
                () => msg("You seem offline") + " - Composer"
            ),
            render: () => html`<offline-page></offline-page>`,
        },
        ...tools_metadata.map((tool) => ({
            path: `/tools/${tool.pathName}`,
            plugins: [lazy(() => import(`./pages/tools/${tool.pathName}.js`))],
            title: localizedTitle(
                () => msgNoExtract(tool.title) + "- Composer"
            ),
            render: () => {
                const tagName = unsafeStatic(
                    `tool-${tool.pathName.replaceAll("_", "-")}`
                );
                return staticHtml`<${tagName}></${tagName}>`;
            },
        })),
    ],
});

export class AppRouter extends LitElement {
    firstUpdated() {
        // eslint-disable-next-line no-unused-vars
        router.addEventListener("route-changed", ({ context }) => {
            if ("startViewTransition" in document) {
                document.startViewTransition(() => this.requestUpdate());
            } else {
                this.requestUpdate();
            }
        });
    }
    render() {
        return router.render();
    }
}

customElements.define("app-router", AppRouter);
