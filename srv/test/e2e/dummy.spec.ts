import { randomUUID } from "node:crypto";
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

    const dummy_ID = randomUUID();

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

    it("should create new dummy with all props", async () => {
        await db.run(
            INSERT.into(cds_runtime.db_dummy().Dummies).entries([
                {
                    ID: dummy_ID,
                    name: "test 1",
                    optionalProp001: "001",
                    optionalProp002: "002",
                    optionalProp003: "003",
                    optionalProp004: "004",
                    nested: [],
                },
            ]),
        );
    });

    it('should create new dummy with "name" only', async () => {
        /**
         * FIXME: It must never be an error!
         *  Currently TypeScript expects the whole object to be provided via INSERT(...)
         */
        // @ts-expect-error
        await db.run(INSERT.into(cds_runtime.db_dummy().Dummies).entries([{ name: "test 2" }]));
    });

    it("should select dummy by key", async () => {
        const dummy = await SELECT.from(cds_runtime.db_dummy().Dummies).byKey(dummy_ID);
        expect(dummy).toBeDefined();
    });

    it("should update dummy with nested objs", async () => {
        await db.run(
            UPDATE.entity(cds_runtime.db_dummy().Dummies)
                .byKey(dummy_ID)
                /**
                 * FIXME: It must never be an error!
                 *  Currently TypeScript requires the whole object to be provided in property "nested"
                 */
                // @ts-expect-error
                .set({
                    nested: [{ ID: randomUUID() }],
                }),
        );
    });
});
