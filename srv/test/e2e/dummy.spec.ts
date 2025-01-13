import cds, { Service } from "@sap/cds";
import { cds_db_dummy, cds_runtime } from "../../src/cds";
import { initializeMockCdsServer } from "./utils/init.mock.cds.server";

describe("Dummy Service", () => {
    const { instance, start } = initializeMockCdsServer();
    let db: Service;

    beforeAll(async () => {
        await start();
        db = await cds.connect.to("db");
    });

    it("should call randomize(...)", async () => {
        const response = await instance.get("/dummy-service/randomize()");
        expect(response.status).toBe(200);

        const body = response.data;
        expect(body.value).toStrictEqual(expect.any(Number));
    });

    it("should get 0 dummies", async () => {
        const dummies: cds_db_dummy.Dummy[] = await db.run(
            SELECT.from(cds_runtime.db_dummy().Dummies),
        );

        expect(dummies).toStrictEqual([]);
    });

    // in order to reproduce TypeScript errors, please remove '@ts-expect-error' comments bellow...
    it('should pick CDS projection names for CDS entity "Dummies"', () => {
        /**
         * (BUG #1)
         *  It's a TypeScript error, saying that: property 'Dummies' doesn't exist... Do you mean 'MyDummies' instead?
         *  The same story for the singular prop name "Dummy" too.
         */

        // @ts-expect-error
        expect(cds_runtime.srv_dummy().Dummies).toBeDefined();
        // @ts-expect-error
        expect(cds_runtime.srv_dummy().Dummies.name).toBe("DummyService.Dummies");
        // @ts-expect-error
        expect(cds_runtime.srv_dummy().Dummy).toBeDefined();
        // @ts-expect-error
        expect(cds_runtime.srv_dummy().Dummy.name).toBe("DummyService.Dummies");

        /**
         * (BUG #2)
         *  Instead... the properties 'MyDummies' & 'MyDummy' are exposed
         */

        expect(cds_runtime.srv_dummy().MyDummies).toBeDefined();
        expect(cds_runtime.srv_dummy().MyDummies.name).toBe("DummyService.Dummies");

        /**
         * (BUG #3)
         * Even if it's expected to be exposed... It says that 'is_singular: true',
         *  whereas the property name is plural
         */

        // @ts-ignore
        expect(cds_runtime.srv_dummy().MyDummies).toStrictEqual(cds_runtime.srv_dummy().Dummies);

        /**
         * (BUG #4)
         * 'MyDummy' is not defined on the runtime... whereas it's obtainable on the build-time
         */

        expect(cds_runtime.srv_dummy().MyDummy).toBeDefined();
    });
});
