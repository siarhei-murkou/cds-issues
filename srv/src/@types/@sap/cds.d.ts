import cds from "@sap/cds";

declare module "@sap/cds" {
    namespace ql {
        interface SELECT<T> extends cds.ql.SELECT<T> {
            byKey(x: number | string | object): this;
        }
    }
}
