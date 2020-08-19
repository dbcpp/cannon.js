function eMath() {}

module.exports = eMath;

eMath.ACCURACY_SIN_ERROR = 1e-16;
eMath.ACCURACY_COS_ERROR = 1e-16;
eMath.ACCURACY_TAN_ERROR = 1e-16;
eMath.DEG = 57.29577951308232;
eMath.RAD = 0.017453292519943295;
eMath.PI = 3.141592653589793;
eMath.E = 2.718281828459045;
eMath.LN2 = 0.6931471805599453;
eMath.LN10 = 2.302585092994046;
eMath.LOG2E = 1.4426950408889634;
eMath.LOG10E = 0.4342944819032518;
eMath.SQRT1_2 = 0.7071067811865476;
eMath.SQRT2 = 1.4142135623730951;
eMath.chain = null;

eMath.getDecimalPlace = function (num) {
    if (num && num !== Math.floor(num)) {
        for (var n = 1, m = 10, temp = 0; n < 20; n += 1, m *= 10) {
            temp = num * m;
            if (temp == Math.floor(temp)) return n;
        }

        return 20;
    } else {
        return 0;
    }
};

eMath.toFixed = function (num) {
    var n = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 0;

    if (n == 0) {
        return Math.round(num);
    } else {
        var m = Math.pow(10, n);
        return Math.round(num * (m * 10) / 10) / m;
    }
};

eMath.abs = function (x) {
    return Math.abs(x);
};

eMath.round = function (x) {
    return Math.round(x);
};

eMath.ceil = function (x) {
    return Math.ceil(x);
};

eMath.floor = function (x) {
    return Math.floor(x);
};

eMath.min = function () {
    return Math.min.apply(Math, arguments);
};

eMath.max = function () {
    return Math.max.apply(Math, arguments);
};

eMath.add = function () {
    for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
    }

    if (args.length === 2) {
        var num1 = args[0];
        var num2 = args[1];
        var m = Math.pow(10, Math.max(eMath.getDecimalPlace(num1), eMath.getDecimalPlace(num2)));
        return (eMath.toFixed(num1 * m) + eMath.toFixed(num2 * m)) / m;
    } else {
        return args.reduce(function (a, b) {
            return eMath.add(a, b);
        });
    }
};

eMath.sub = function () {
    for (var _len2 = arguments.length, args = new Array(_len2), _key2 = 0; _key2 < _len2; _key2++) {
        args[_key2] = arguments[_key2];
    }

    if (args.length === 2) {
        var num1 = args[0];
        var num2 = args[1];
        var m = Math.pow(10, Math.max(eMath.getDecimalPlace(num1), eMath.getDecimalPlace(num2)));
        return (eMath.toFixed(num1 * m) - eMath.toFixed(num2 * m)) / m;
    } else {
        return args.reduce(function (a, b) {
            return eMath.sub(a, b);
        });
    }
};

eMath.mul = function () {
    for (var _len3 = arguments.length, args = new Array(_len3), _key3 = 0; _key3 < _len3; _key3++) {
        args[_key3] = arguments[_key3];
    }

    if (args.length === 2) {
        var num1 = args[0];
        var num2 = args[1]; // 方案1：
        // 直接相乘，但是相乘两数小数点过多会导致中间值[(n1 * m1) * (n2 * m2)]过大
        // const n1 = eMath.getDecimalPlace(num1);
        // const n2 = eMath.getDecimalPlace(num2);
        // const m1 = Math.pow(10, n1);
        // const m2 = Math.pow(10, n2);
        // return (n1 * m1) * (n2 * m2) / (m1 * m2);
        // 方案2：
        // 用除法实现乘法，不会存在过大中间值

        var n1 = eMath.getDecimalPlace(num1);
        var n2 = eMath.getDecimalPlace(num2);
        var m = Math.pow(10, n2);
        num2 = m / eMath.toFixed(num2 * m);
        m = Math.pow(10, Math.max(n1, eMath.getDecimalPlace(num2)));
        m = eMath.toFixed(num1 * m) / eMath.toFixed(num2 * m);
        var n = Math.min(eMath.getDecimalPlace(m), n1 + n2);
        return eMath.toFixed(m, n);
    } else {
        return args.reduce(function (a, b) {
            return eMath.mul(a, b);
        });
    }
};

eMath.div = function () {
    for (var _len4 = arguments.length, args = new Array(_len4), _key4 = 0; _key4 < _len4; _key4++) {
        args[_key4] = arguments[_key4];
    }

    if (args.length === 2) {
        var num1 = args[0];
        var num2 = args[1];
        var m = Math.pow(10, Math.max(eMath.getDecimalPlace(num1), eMath.getDecimalPlace(num2)));
        return eMath.toFixed(num1 * m) / eMath.toFixed(num2 * m);
    } else {
        return args.reduce(function (a, b) {
            return eMath.div(a, b);
        });
    }
};

eMath.rem = function () {
    for (var _len5 = arguments.length, args = new Array(_len5), _key5 = 0; _key5 < _len5; _key5++) {
        args[_key5] = arguments[_key5];
    }

    if (args.length === 2) {
        var num1 = args[0];
        var num2 = args[1];
        var m = Math.pow(10, Math.max(eMath.getDecimalPlace(num1), eMath.getDecimalPlace(num2)));
        return eMath.toFixed(num1 * m) % eMath.toFixed(num2 * m) / m;
    } else {
        return args.reduce(function (a, b) {
            return eMath.rem(a, b);
        });
    }
};

eMath.pow = function (num, n) {
    if (num == 0 && n == 0) {
        return 1;
    }

    if (num == 0 && n > 0) {
        return 0;
    }

    if (num == 0 && n < 0) {
        return Infinity;
    } // num为负数，n为负小数，返回NaN


    if (num < 0 && n < 0 && Math.round(n) != n) {
        return NaN;
    }

    if (Math.round(n) != n) {
        throw new Error('n must be an integer');
    }

    var result = 1;

    if (n > 0) {
        for (var index = 0; index < n; index++) {
            result = eMath.mul(result, num);
        }
    } else if (n < 0) {
        for (var _index = 0, len = Math.abs(n); _index < len; _index++) {
            result = eMath.div(result, num);
        }
    }

    return result;
};

eMath.sqrt = function (n) {
    if (n < 0) return NaN;
    if (n === 0) return 0;
    if (n === 1) return 1;
    var last = 0;
    var res = 1;
    var c = 50;

    while (res != last && --c >= 0) {
        last = res;
        res = eMath.div(eMath.add(res, eMath.div(n, res)), 2);
    }

    return res;
};

eMath.randomSeed = void 0;

eMath.setSeed = function (seed) {
    eMath.randomSeed = eMath.getSeed(seed);
};

eMath.andom = function () {
    eMath.randomSeed = (eMath.randomSeed * 9301 + 49297) % 233280;
    return eMath.randomSeed / 233280.0;
};

eMath.randomBySeed = function (seed) {
    seed = eMath.getSeed(seed);
    seed = (seed * 9301 + 49297) % 233280;
    return seed / 233280.0;
};

eMath.radiansToDegrees = function (radians) {
    return eMath.div(radians, eMath.RAD);
};

eMath.degreesToRadians = function (degrees) {
    return eMath.div(degrees, eMath.DEG);
};

eMath.get0To360Angle = function (angle) {
    if (angle === 0) {
        return 0;
    } else if (angle < 0) {
        return eMath.add(eMath.rem(angle, 360), 360);
    } else {
        return eMath.rem(angle, 360);
    }
};

eMath._sin = {};
eMath._cos = {};
eMath._tan = {};
eMath._atan2 = {};
eMath._asin = {};
eMath._acos = {};

eMath.sin = function (x) {
    if (eMath._sin.hasOwnProperty(x)) {
        return eMath._sin[x];
    }

    return eMath.toFixed(Math.sin(x), 4);
};

eMath.cos = function (x) {
    if (eMath._cos.hasOwnProperty(x)) {
        return eMath._cos[x];
    }

    return eMath.toFixed(Math.cos(x), 4);
};

eMath.tan = function (x) {
    if (eMath._tan.hasOwnProperty(x)) {
        return eMath._tan[x];
    }

    return eMath.toFixed(Math.tan(x), 4);
};

eMath.atan2 = function (x, y) {
    // if (eMath._atan2.hasOwnProperty(`${x}|${y}`)) {
    //     return eMath._atan2[`${x}|${y}`];
    // }
    // return eMath.toFixed(Math.atan2(x, y), 4);
    return Math.atan2(x, y)
};

eMath.asin = function (x) {
    // if (eMath._asin.hasOwnProperty(x)) {
    //     return eMath._asin[x];
    // }
    // return eMath.toFixed(Math.asin(x), 4);
    return Math.asin(x)
};

eMath.acos = function (x) {
    // if (eMath._asin.hasOwnProperty(x)) {
    //     return eMath._acos[x];
    // }
    // return eMath.toFixed(Math.acos(x), 4);
    return Math.acos(x)
};

