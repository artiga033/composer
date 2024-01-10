/**
 * @description A tools metadata
 */
interface Metadata {
    name: string
    description: string
    title: string
    /** the string used as the tool path, without and prefix or suffix */
    pathName: string
}
declare module 'virtual:*' {
    /**
     * @description The tools metadata 
     * generated from source at build time, by a vite plugin,
     * so that no runtime configuration is applied.
     * 
     * e.g at runtime, you shoule again localize the strings with `msg` function
     */
    const tools_metadata: Metadata[];
    export default tools_metadata;
}