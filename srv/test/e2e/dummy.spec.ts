import { randomUUID } from "node:crypto";
import cds, { Service } from "@sap/cds";
import { cds_runtime } from "../../src/cds";
import { initializeMockCdsServer } from "./utils/init.mock.cds.server";

describe("Dummy Service", () => {
    const { instance, start } = initializeMockCdsServer();
    let db: Service;

    const dummy_ID = randomUUID();
    const prop_002 = randomUUID();

    /**
     * this size works fine for SQLite
     *  but breaks queries to HANA with error "maximum packet size exceeded"
     */
    const SIZE = 3000;

    const sets = [...Array(SIZE)].map(() => ({
        prop_001: randomUUID(),
        prop_002,
    }));

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

    it("should initialize empty dummy", async () => {
        await db.run(
            INSERT.into(cds_runtime.db_dummy().Dummies).entries({
                ID: dummy_ID,
                name: "tempo",
                sets: [],
            }),
        );
    });

    it("should populate dummy sets", async () => {
        await db.run(
            UPDATE.entity(cds_runtime.db_dummy().Dummies).byKey(dummy_ID).set({
                sets: sets,
            }),
        );
    });

    it("should update dummy sets", async () => {
        await db.run(
            UPDATE.entity(cds_runtime.db_dummy().Dummies)
                .byKey(dummy_ID)
                .set({
                    sets: sets.map((s, i) => ({
                        prop_001: i > SIZE - 10 ? randomUUID() : s.prop_001,
                        prop_002,
                    })),
                }),
        );
    });
});
