import { configureLocalization } from "@lit/localize";
import {
    sourceLocale,
    targetLocales,
    allLocales,
} from "../generated/locale-codes";
class LocalizeController {
    constructor() {
        this.inner = configureLocalization({
            sourceLocale,
            targetLocales,
            loadLocale: (locale) => import(`../generated/locales/${locale}.js`),
        });
        this.hosts = [];
    }

    async setLocale(locale) {
        localStorage.setItem("locale", locale);
        await this.inner.setLocale(locale);
    }
    getLocale() {
        return this.inner.getLocale();
    }
}

let instance = null;

function uniqueInstance() {
    if (!instance) {
        instance = new LocalizeController();
        if (localStorage.getItem("locale")) {
            instance.setLocale(localStorage.getItem("locale"));
        } else if (navigator.languages.length > 0) {
            for (const lang of navigator.languages) {
                if (allLocales.includes(lang)) {
                    instance.setLocale(lang);
                    break;
                }
            }
        }
    }
    return instance;
}

export default uniqueInstance();
