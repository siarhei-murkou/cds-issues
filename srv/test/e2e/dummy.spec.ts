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

    it("should call execute() via test() & return 500 via test()", async () => {
        const response = await instance.post("/dummy-service/test");
        expect(response.status).toBe(500);
    });

    it("should get 1 dummy created via execute()", async () => {
        const dummies: cds_db_dummy.Dummy[] = await db.run(
            SELECT.from(cds_runtime.db_dummy().Dummies),
        );

        expect(dummies).toStrictEqual([
            { name: "test", description: "Test Description" } satisfies cds_db_dummy.Dummy,
        ]);
    });
});
