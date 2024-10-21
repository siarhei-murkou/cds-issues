import cds from "@sap/cds";
import { AxiosInstance } from "axios";

let isEnvPrepared = false;

export function initializeMockCdsServer(): {
    instance: AxiosInstance;
    start: () => Promise<void>;
    /**
     * don't use stop inside describe(...) b/c it's called automatically.
     *  this fn is only for custom usages.
     */
    stop: () => Promise<void>;
} {
    if (!isEnvPrepared) {
        global.console = require("console");
        isEnvPrepared = true;
    }

    const test = cds.test("./", "--profile", "test", "--in-memory", "--with-mocks");
    const instance = test.axios;
    instance.defaults.validateStatus = () => true;

    const start = async () => {
        await test;
    };

    const stop = () =>
        new Promise<void>(resolve => {
            test.cds.on("shutdown", resolve);

            // @ts-ignore
            test.cds.shutdown();
        });

    return { instance, start, stop };
}
