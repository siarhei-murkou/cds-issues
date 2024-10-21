import cds from "@sap/cds";
import { cds_runtime } from "../cds";

module.exports = cds.service.impl(async function () {
    this.on(cds_runtime.srv_dummy().randomize, () => Math.floor(Math.random() * 10) + 1);
});
