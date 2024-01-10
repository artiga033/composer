class Color {
    /**@type {number} */
    r;
    /**@type {number} */
    g;
    /**@type {number} */
    b;
    constructor(r, g, b) {
        this.r = r;
        this.g = g;
        this.b = b;
    }
    static fromHex(hex) {
        const o = new Color();
        const offset = hex.startsWith("#") ? 1 : 0;
        o.r = parseInt(hex.substring(offset, offset + 2), 16);
        o.g = parseInt(hex.substring(offset + 2, offset + 4), 16);
        o.b = parseInt(hex.substring(offset + 4, offset + 6), 16);
        return o;
    }
    toHex() {
        return (
            "#" +
            this.r.toString(16).padStart(2, "0") +
            this.g.toString(16).padStart(2, "0") +
            this.b.toString(16).padStart(2, "0")
        );
    }
}
const SchemaSymbols = [
    Symbol.for("background"),
    Symbol.for("foreground"),
    Symbol.for("cursor"),
    Symbol.for("cursorText"),
    Symbol.for("selection"),
    Symbol.for("selectionText"),
    Symbol.for("black"),
    Symbol.for("red"),
    Symbol.for("green"),
    Symbol.for("yellow"),
    Symbol.for("blue"),
    Symbol.for("magenta"),
    Symbol.for("cyan"),
    Symbol.for("white"),
    Symbol.for("brightBlack"),
    Symbol.for("brightRed"),
    Symbol.for("brightGreen"),
    Symbol.for("brightYellow"),
    Symbol.for("brightBlue"),
    Symbol.for("brightMagenta"),
    Symbol.for("brightCyan"),
    Symbol.for("brightWhite"),
];

class WindowsTerminalConverter {
    jsonPropertyNames = [
        "background",
        "foreground",
        "cursorColor",
        null,
        "selectionBackground",
        null,
        "black",
        "red",
        "green",
        "yellow",
        "blue",
        "purple",
        "cyan",
        "white",
        "brightBlack",
        "brightRed",
        "brightGreen",
        "brightYellow",
        "brightBlue",
        "brightPurple",
        "brightCyan",
        "brightWhite",
    ];
    /**
     * Loads a Windows Terminal configuration schema, and converts it to a `Schema` object
     * @param {string|Record<string,string>} schema_wt The schema from Windows Terminal configuration
     */
    load(schema_wt) {
        const schema = {};
        if (typeof schema_wt === "string") {
            if (typeof schema_wt === "string") {
                schema_wt = JSON.parse(schema_wt);
            }
            for (const i in this.jsonPropertyNames) {
                const name = this.jsonPropertyNames[i];
                const symbol = SchemaSymbols[i];
                if (name) {
                    if (!schema_wt[name]) {
                        console.log(
                            `Parsing Windows Terminal Schema, property \`${name}\` is not found.`
                        );
                        continue;
                    }
                    schema[symbol] = Color.fromHex(schema_wt[name]);
                }
            }
        }
        return schema;
    }
    /**
     * Converts a `Schema` object to a Windows Terminal configuration schema
     * @param {Record<symbol,Color>} schema The schema to convert
     */
    dump(schema) {
        const schema_wt = {};
        for (const i in this.jsonPropertyNames) {
            const name = this.jsonPropertyNames[i];
            const symbol = SchemaSymbols[i];
            if (name) {
                if (!schema[symbol]) {
                    console.log(
                        `Dumping Windows Terminal Schema, property \`${name}\` is not found.`
                    );
                    continue;
                }
                schema_wt[name] = schema[symbol].toHex();
            }
        }

        return JSON.stringify(schema_wt, null, 4);
    }
}

class KonsoleConverter {
    SectionNames = [
        "Background",
        "Foreground",
        null,
        null,
        null,
        null,
        "Color0",
        "Color1",
        "Color2",
        "Color3",
        "Color4",
        "Color5",
        "Color6",
        "Color7",
        "Color0Intense",
        "Color1Intense",
        "Color2Intense",
        "Color3Intense",
        "Color4Intense",
        "Color5Intense",
        "Color6Intense",
        "Color7Intense",
    ];
    // eslint-disable-next-line no-unused-vars
    load(schema_ks) {
        throw new Error("Not implemented");
    }
    /**
     *
     * @param {Record<symbol,Color>} schema
     * @returns
     */
    dump(schema) {
        let schema_konsole = "";
        for (const i in this.SectionNames) {
            const name = this.SectionNames[i];
            const symbol = SchemaSymbols[i];
            if (name) {
                if (!schema[symbol]) {
                    console.log(
                        `Dumping Konsole Schema, property \`${name}\` is not found.`
                    );
                    continue;
                }
                schema_konsole += `[${name}]\nColor=${schema[symbol].r.toString(
                    10
                )},${schema[symbol].g.toString(10)},${schema[symbol].b.toString(
                    10
                )}\n\n`;
            }
        }
        return schema_konsole;
    }
}

/**
 * @typedef {"Windows Terminal"|"Konsole"} TerminalType
 */
export class Converter {
    /**
     * @type {Record<TerminalType,Converter>}
     */
    static converters = {
        "Windows Terminal": new WindowsTerminalConverter(),
        Konsole: new KonsoleConverter(),
    };
    /**
     *
     * @param {string} schema The schema content to convert
     * @param {TerminalType} from
     * @param {TerminalType} to
     * @returns {string} converted result
     */
    static convert(schema, from, to) {
        return Converter.converters[to].dump(
            Converter.converters[from].load(schema)
        );
    }
}
