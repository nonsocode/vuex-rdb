export declare function normalize(raw: any, entityName: string | [string], visited?: Map<any, string | number>, entities?: {}, depth?: number): {
    result: any;
    entities: {};
};
declare global {
    interface Window {
        normalize: any;
        Schema: any;
        normalizr: any;
    }
}
