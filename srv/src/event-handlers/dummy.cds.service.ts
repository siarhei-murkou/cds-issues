import cds from "@sap/cds";
import { cds_runtime } from "../cds";

module.exports = cds.service.impl(async function () {
    this.on(cds_runtime.srv_dummy().fn001, () => "success");
    this.on(cds_runtime.srv_dummy().fn002, () => "success");
});
