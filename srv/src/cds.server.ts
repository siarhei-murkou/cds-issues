import assert from "node:assert";
import cds from "@sap/cds";
import { cds_runtime } from "./cds";

const logger = cds.log("cds-server");

/**
 * Here is a custom implementation of CDS server
 * @link https://pages.github.tools.sap/cap/docs/node.js/cds-server#custom-server-js
 */
export async function initializeServer(o: unknown) {
    cds.on("shutdown", () => logger.info("CAP backend is being stopped..."));

    cds.on("listening", () => {
        process.env.CDS_ENV && logger.info("CDS ENV:", process.env.CDS_ENV);
        process.env.NODE_ENV && logger.info("NODE ENV:", process.env.NODE_ENV);
    });

    cds.on("connect", () => {
        cds.db.prepend(db => {
            const targets = [
                cds_runtime.srv_dummy().SharedTopObjects,
                cds_runtime.db_dummy().AdvancedSharedTopObjects,
            ];

            db.on("DELETE", targets, async (request, next) => {
                const { target, query } = request;
                assert.ok(query.DELETE, 'the property "request.query.DELETE" not found');

                /** double-checking to avoid accident removal in other DB tables */
                if (targets.some(({ name }) => name === target.name)) {
                    logger.info(`(HERE WE GO) — deleting records over ${target.name}...`);

                    const table = cds_runtime.db_dummy().SharedSubObjects.name;

                    const select =
                        typeof query.DELETE.from === "string"
                            ? SELECT.from(query.DELETE.from)
                            : SELECT.from(query.DELETE.from);

                    /** disallow deleting with no conditions */
                    if (
                        (!query.DELETE.where || !query.DELETE.where.length) &&
                        (typeof query.DELETE.from === "string" ||
                            !query.DELETE.from.ref ||
                            !query.DELETE.from.ref!.some(
                                segment =>
                                    typeof segment !== "string" &&
                                    !!segment.where &&
                                    !!segment.where.length,
                            ))
                    ) {
                        throw Error("You must define where(...) condition per DELETE query");
                    }

                    await db.run(
                        DELETE.from(`${table} as ss`).where({
                            exists: select
                                .alias("ast")
                                .where(query.DELETE.where ?? {})
                                .where("linked.sub_ID = ss.sub_ID")
                                .where("linked.shared_ID = ss.shared_ID"),
                        }),
                    );
                }

                return next();
            });
        });
    });

    try {
        return await cds.server(o);
    } catch (exception) {
        logger.error(exception);
        return cds.exit();
    }
}
