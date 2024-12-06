import assert from "node:assert";
import cds from "@sap/cds";
import { AuditLogService } from "@cap-js/audit-logging";
import { cds_db_dummy, cds_runtime } from "../cds";

module.exports = cds.service.impl(async function () {
    const db = await cds.connect.to("db");
    const audits = await cds.connect.to("audit-log");

    assert.ok(audits instanceof AuditLogService);

    this.on(cds_runtime.srv_dummy().randomize, () => Math.floor(Math.random() * 10) + 1);

    this.on(cds_runtime.srv_dummy().execute, async () => {
        await db.run(
            INSERT.into(cds_runtime.db_dummy().Dummies).entries({
                name: "test",
                description: "New Description",
            } satisfies cds_db_dummy.Dummy),
        );

        await db.run(
            UPDATE.entity(cds_runtime.db_dummy().Dummies)
                .where({ name: "test" } satisfies Pick<cds_db_dummy.Dummy, "name">)
                .set({ description: "Updated Description" } satisfies Partial<cds_db_dummy.Dummy>),
        );

        await db.run(
            DELETE.from(cds_runtime.db_dummy().Dummies).where({ name: "test" } satisfies Pick<
                cds_db_dummy.Dummy,
                "name"
            >),
        );

        await audits.log("SecurityEvent", {
            data: { summary: "Dummy is Created, Updated & Deleted" },
        });
    });
});
