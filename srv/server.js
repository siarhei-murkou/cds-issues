const filename = "cds.server";
const foldername = process.env.CDS_ENV === "test" ? "src" : "dist";

const { initializeServer } = require([".", foldername, filename].join("/"));

module.exports = initializeServer;
