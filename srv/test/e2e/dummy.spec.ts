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

    it("should get 0 dummies", async () => {
        const dummies: cds_db_dummy.Dummy[] = await db.run(
            SELECT.from(cds_runtime.db_dummy().Dummies),
        );

        expect(dummies).toStrictEqual([]);
    });

    it("should call fn001()", async () => {
        const response = await instance.get("/dummy-service/fn001()");

        expect(response.status).toBe(200);
        expect(response.data).toStrictEqual(expect.objectContaining({ value: "success" }));
    });

    it("should call fn002()", async () => {
        const response = await instance.get("/dummy-service/fn002()");

        expect(response.status).toBe(200);
        expect(response.data).toStrictEqual(expect.objectContaining({ value: "success" }));
    });

    it("should fail to call fn001(test='test')", async () => {
        const response = await instance.get("/dummy-service/fn001(test='test')");

        expect(response.status).toBe(400);
        expect(response.data).toStrictEqual(
            expect.objectContaining({
                error: expect.objectContaining({
                    message: expect.stringMatching(/property "test" does not exist/gi),
                }),
            }),
        );
    });

    it("should fail to call fn002(test='test')", async () => {
        const response = await instance.get("/dummy-service/fn002(test='test')");

        expect(response.status).toBe(400);

        /**
         * FIXME: it must be "property ... does not exist" error similar to prev test case,
         *  but currently it throws internal server error
         */
        expect(response.data).toStrictEqual(
            expect.objectContaining({
                error: expect.objectContaining({
                    message: expect.stringMatching(/malformed parameters/gi),
                }),
            }),
        );
    });
});
