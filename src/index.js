/**
 * Exporting default here so we can use actual class as export for commonjs.
 */
const Tigon = require('./tigon').default;
module.exports = new Tigon();
