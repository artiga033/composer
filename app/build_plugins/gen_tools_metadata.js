import { readFileSync, readdirSync } from "fs";
import { resolve } from "path";

/**@returns {Promise<import("vite").Plugin>} */
export default async function genToolsMetadata() {
    const virtualModuleId = "virtual:tools-metadata";
    const resolvedVirtualModuleId = "\0" + virtualModuleId;

    const extractDeclLiteral = (declAst) => {
        const init = declAst.init;
        if (init.callee.type !== "Identifier" || init.callee.name !== "msg")
            throw new Error(
                "For a tool identifier, msg() must be called for localization"
            );
        const arg1 = init.arguments[0];
        if (arg1.type !== "Literal" || typeof arg1.value !== "string")
            throw new Error(
                "Current only support msg() called with a string literal in a tool identifier"
            );
        return arg1.value;
    };
    return {
        name: "gen-tools-metadata",
        resolveId(id) {
            if (id === virtualModuleId) {
                return resolvedVirtualModuleId;
            }
        },
        load(id) {
            if (id !== resolvedVirtualModuleId) {
                return;
            }
            const tool_dir_path = "./src/pages/tools";
            const tool_files = readdirSync(tool_dir_path).filter((f) =>
                f.endsWith(".js")
            );
            /**@type {Metadata[]} */
            const metadata = [];
            for (const tool_filename of tool_files) {
                const ast = this.parse(
                    readFileSync(resolve(tool_dir_path, tool_filename), {
                        encoding: "utf-8",
                    })
                );

                const exports = ast.body.filter(
                    (e) =>
                        e.type === "ExportNamedDeclaration" &&
                        e.declaration.type === "VariableDeclaration"
                );

                let name;
                let description;
                let title;
                const pathName = tool_filename.substring(
                    0,
                    tool_filename.length - ".js".length
                );
                for (const export_ of exports) {
                    const nameDecl = export_.declaration.declarations.find(
                        (d) => d.id.name === "name"
                    );
                    const descriptionDecl =
                        export_.declaration.declarations.find(
                            (d) => d.id.name === "description"
                        );
                    const titleDecl = export_.declaration.declarations.find(
                        (d) => d.id.name === "title"
                    );

                    if (nameDecl) name = extractDeclLiteral(nameDecl);

                    if (descriptionDecl)
                        description = extractDeclLiteral(descriptionDecl);

                    if (titleDecl) title = extractDeclLiteral(titleDecl);
                }
                if (!name) {
                    console.warn(
                        `tool ${pathName} does not have a name defined, fallback to filename`
                    );
                    name = pathName;
                }
                if (!description) {
                    console.warn(
                        `tool ${pathName} does not have a description defined`
                    );
                    description = "";
                }
                if (!title) {
                    console.warn(
                        `tool ${pathName} does not have a title defined, fallback to name`
                    );
                    title = name;
                }
                metadata.push({
                    name,
                    description,
                    title,
                    pathName,
                });
            }
            const virtFile = `
            import { msg } from "@lit/localize";
            export default [
                ${metadata
                    .map(
                        (m) => `{
                            get name(){return msg("${m.name}")},
                            get description(){return msg("${m.description}")},
                            get title(){return msg("${m.title}")},
                            get pathName(){return "${m.pathName}"}
                        }`
                    )
                    .join(",")}
            ];
        `;
            return virtFile;
        },
    };
}
