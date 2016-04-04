/**
 * Exporting default here so we can use actual class as export for commonjs.
 */
var Tigon = require('./tigon').default;
module.exports = new Tigon();
