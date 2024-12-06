import { initializeMockCdsServer } from "./utils/init.mock.cds.server";
import MockAuditLogCdsService from "../../src/event-handlers/mock.audit.log.cds.service";

describe("Dummy Service", () => {
    const { instance, start } = initializeMockCdsServer();

    beforeAll(async () => {
        await start();
        MockAuditLogCdsService.retain = true;
    });

    afterEach(() => (MockAuditLogCdsService.logs = []));

    it("should call randomize(...)", async () => {
        const response = await instance.get("/dummy-service/randomize()");
        expect(response.status).toBe(200);

        const body = response.data;
        expect(body.value).toStrictEqual(expect.any(Number));
    });

    it("should call execute(...)", async () => {
        const response = await instance.post("/dummy-service/execute");
        expect(response.status).toBe(204);

        // (!BUG) there should have been 3 more audit logs per INSERT, UPDATE, DELETE queries
        expect(MockAuditLogCdsService.logs).toStrictEqual([
            {
                event: "SecurityEvent",
                data: expect.objectContaining({
                    data: expect.objectContaining({
                        summary: "Dummy is Created, Updated & Deleted",
                    }),
                }),
            },
        ]);
    });

    it("should call POST & DELETE on dummies", async () => {
        {
            const response = await instance.post("/dummy-service/Dummies", {
                name: "test",
                description: "Custom Description",
            });

            expect(response.status).toBe(201);
        }

        {
            const response = await instance.delete("/dummy-service/Dummies(name='test')");
            expect(response.status).toBe(204);
        }

        expect(MockAuditLogCdsService.logs).toStrictEqual([
            // audit log triggered by POST request
            {
                event: "PersonalDataModified",
                data: expect.objectContaining({
                    attributes: [{ name: "description", new: "Custom Description" }],
                }),
            },
            // audit log triggered by DELETE request
            {
                event: "PersonalDataModified",
                data: expect.objectContaining({
                    attributes: [{ name: "description", old: "Custom Description" }],
                }),
            },
        ]);
    });
});
