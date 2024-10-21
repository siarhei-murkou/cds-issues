import { cds_db_dummy, cds_srv_dummy } from "./buildtime";

export const cds_runtime: cds_runtime = {
    srv_dummy: () => require("#cds-models/DummyService"),
    db_dummy: () => require("#cds-models/sap/cap/issues"),
};

type cds_runtime = {
    srv_dummy: () => typeof cds_srv_dummy;
    db_dummy: () => typeof cds_db_dummy;
};
