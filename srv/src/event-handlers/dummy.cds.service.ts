import cds from "@sap/cds";
import { cds_db_dummy, cds_runtime } from "../cds";

module.exports = cds.service.impl(async function () {
    const db = await cds.connect.to("db");
    const srv = this;

    this.on(cds_runtime.srv_dummy().randomize, () => Math.floor(Math.random() * 10) + 1);

    this.on(cds_runtime.srv_dummy().execute, async () => {
        await db.run(
            INSERT.into(cds_runtime.db_dummy().Dummies).entries({
                name: "test",
                description: "Test Description",
            } satisfies cds_db_dummy.Dummy),
        );
    });

    this.on(cds_runtime.srv_dummy().test, async request => {
        await srv.tx(tx => tx.send("execute"));

        return request.error(500, "something went wrong...");
    });
});
