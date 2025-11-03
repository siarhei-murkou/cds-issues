import cds from "@sap/cds";
import { cds_runtime } from "../cds";

module.exports = cds.service.impl(async function () {
    this.on(cds_runtime.srv_dummy().randomize, () => Math.floor(Math.random() * 10) + 1);

    this.before(cds_runtime.srv_dummy().ping, request => {
        const { p } = request.data;

        // doing some manual validation for property "p"
        if (!p.includes("test")) return request.error(400, 'param must include "test"');

        return;
    });

    this.on(cds_runtime.srv_dummy().ping, () => {
        return "success";
    });
});
