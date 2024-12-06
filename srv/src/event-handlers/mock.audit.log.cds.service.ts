import cds from "@sap/cds";
import { AuditLogService as CapJsAuditLogService } from "@cap-js/audit-logging";

class MockAuditLogCdsService extends CapJsAuditLogService {
    private static readonly logger = cds.log("mock-audit-logs");

    public async init() {
        if (process.env.CDS_ENV !== "test")
            throw new Error("MockAuditLogCdsService is only allowed for CDS profile 'test'");

        const log = MockAuditLogCdsService.log.bind(MockAuditLogCdsService);
        this.on("*", log);

        await super.init();
    }

    /**
     * This property is responsible for retaining logs in internal array
     *  (as public static property 'logs')
     */
    public static retain = false;

    private static async log(request: cds.Request) {
        const { event, data } = request;
        this.logger.info(event, data);

        if (this.retain) this.logs.push({ event, data });
    }

    public static logs: { event: string; data: object }[] = [];
}

export = MockAuditLogCdsService;
