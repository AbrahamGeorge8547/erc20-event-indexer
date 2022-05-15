"use strict";
exports.__esModule = true;
var os_1 = require("os");
var app = function () {
    console.log(process.argv[2], os_1["default"].cpus().length);
};
app();
