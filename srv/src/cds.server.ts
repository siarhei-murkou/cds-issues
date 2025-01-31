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

                    assert.ok(
                        typeof query.DELETE.from !== "string",
                        'the property "request.query.DELETE.from" must not be a string',
                    );

                    assert.ok(
                        "ref" in query.DELETE.from && query.DELETE.from.ref,
                        'the property "request.query.DELETE.from.ref" must be defined',
                    );

                    assert.ok(
                        query.DELETE.from.ref.length > 0,
                        'the property "request.query.DELETE.from.ref" must be non-empty array',
                    );

                    const ref = [...query.DELETE.from.ref];

                    const last = ref.length - 1;
                    if (typeof ref[last] === "string" && query.DELETE.where) {
                        const id = ref[last];

                        // @ts-expect-error FIXME: cast predicate to xpr
                        ref[last] = { id, where: query.DELETE.where };
                    }

                    type TargetEntityProperty = keyof (typeof targets)[0]["prototype"][0];

                    ref.push("linked" satisfies TargetEntityProperty);

                    await db.run(DELETE.from({ ref }));
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
