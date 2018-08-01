"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var Calc = /** @class */ (function () {
    function Calc() {
    }
    Calc.prototype.add = function (num1, num2) {
        return num1 + num2;
    };
    Calc.prototype.subtract = function (num1, num2) {
        return num1 - num2;
    };
    return Calc;
}());
exports.Calc = Calc;
exports.default = Calc;
