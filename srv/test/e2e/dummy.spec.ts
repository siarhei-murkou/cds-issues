import cds, { Service } from "@sap/cds";
import { cds_runtime } from "../../src/cds";
import { initializeMockCdsServer } from "./utils/init.mock.cds.server";

describe("Dummy Service", () => {
    const { instance, start } = initializeMockCdsServer();
    let db: Service;

    beforeAll(async () => {
        await start();
        db = await cds.connect.to("db");
    });

    const shared_ID = "0000000001";
    const sub_ID = "0000000002";
    const top_ID = "0000000003";

    it('should init "shared" & "sub" & "top" objects', async () => {
        const responses = await Promise.all([
            instance.post("/dummy-service/SharedObjects", { ID: shared_ID, name: "shared" }),
            instance.post("/dummy-service/TopObjects", { ID: top_ID, name: "top" }),
        ]);

        for (const response of responses) expect(response.status).toBe(201);

        const sub = { ID: sub_ID, top_ID, name: "sub" };
        // executing separately coz "top_ID" must be created at first
        const response = await instance.post("/dummy-service/SubObjects", sub);
        expect(response.status).toBe(201);
    });

    it('should link "shared" with "sub" & "top" objects', async () => {
        const obj = { shared_ID, top_ID, linked: { shared_ID, sub_ID, type: "low" } };
        const response = await instance.post("/dummy-service/SharedTopObjects", obj);
        expect(response.status).toBe(201);
    });

    it("should remove non-existing shared top object", async () => {
        const where = { shared_ID, top_ID: "0000000000" };
        await db.run(DELETE.from(cds_runtime.srv_dummy().SharedTopObjects).where(where));
    });

    it("should get shared sub object", async () => {
        const response = await instance.get(`/dummy-service/SharedSubObjects`);
        expect(response.status).toBe(200);

        expect(response.data).toStrictEqual(
            expect.objectContaining({ value: [expect.objectContaining({ shared_ID, sub_ID })] }),
        );
    });

    // ... and it must remove it together with shared sub object
    it("should remove shared top object", async () => {
        const response = await instance.delete(
            // `/dummy-service/SharedTopObjects(shared_ID='${shared_ID}',top_ID='${top_ID}')`,
            /** trying out the `deep` DELETE through the parent CDS projection */
            `/dummy-service/SharedObjects/${shared_ID}/top(shared_ID='${shared_ID}',top_ID='${top_ID}')`,
        );
        expect(response.status).toBe(204);
    });

    it("should get neither shared sub nor shared top objects", async () => {
        const responses = await Promise.all([
            instance.get("/dummy-service/SharedTopObjects"),
            instance.get("/dummy-service/SharedSubObjects"),
        ]);

        for (const response of responses) expect(response.status).toBe(200);

        expect(responses.map(({ data }) => data)).toStrictEqual([
            expect.objectContaining({ value: [] }),
            expect.objectContaining({ value: [] }),
        ]);
    });
});
