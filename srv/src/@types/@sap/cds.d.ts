import cds from "@sap/cds";

declare module "@sap/cds" {
    namespace ql {
        interface SELECT<T> extends cds.ql.SELECT<T> {
            byKey(x: number | string | object): this;
        }

        interface INSERT<T> extends cds.ql.INSERT<T> {
            entries(entries: Partial<T>[]): this;
            entries(...entries: Partial<T>[]): this;
        }
    }
}
