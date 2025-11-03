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

    it("should fail to call ping() with no param", async () => {
        const response = await instance.get("/dummy-service/ping()");
        expect(response.status).toBe(400);
        expect(response.data).toStrictEqual({
            error: expect.objectContaining({ message: "Value is required" }),
        });
    });
});
