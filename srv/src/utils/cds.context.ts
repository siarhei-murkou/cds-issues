import cds_1 from "@sap/cds";
import * as cds_2 from "@sap/cds";

export function reproduceIssue() {
    if (cds_1.context) {
        // @ts-expect-error FIXME: it must never 'undefinable' after if (...)
        cds_1.context.http;

        // @ts-expect-error FIXME: it must never 'undefinable' after if (...)
        cds_1.context satisfies cds_1.EventContext;
    }

    if (cds_2.context) {
        cds_2.context.http;
        cds_2.context satisfies cds_2.EventContext;
    }
}
