declare module "@cap-js/audit-logging" {
    import { Service } from "@sap/cds";

    class AuditLogService extends Service {
        log(
            target: "SensitiveDataRead",
            payload: { data_subject: {}; object: {}; attributes: {} },
        ): Promise<void>;

        log(
            target: "PersonalDataModified",
            payload: { data_subject: {}; object: {}; attributes: {} },
        ): Promise<void>;

        log(
            target: "ConfigurationModified",
            payload: { object: {}; attributes: {} },
        ): Promise<void>;

        log(target: "SecurityEvent", payload: { data: {}; ip?: string }): Promise<void>;
    }
}
