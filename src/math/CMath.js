

var ang2rad = Math.PI / 180;
var rad2ang = 180 / Math.PI;
function radian2angle (rad) {
    return rad * rad2ang;
}

var sinArr = {};
function calculateSinByDigit (digit) {
    var step = 1 / Math.pow(10, digit);
    for (var i = 0; i <= 90; i += step) {
        sinArr[i.toFixed(digit)] = Math.sin(i * ang2rad);
    }
}

function sin360 (angle, digit) {
    if (angle <= 90) {
        return sinArr[angle.toFixed(digit)];
    } else if (angle <= 180) {
        angle = 180 - angle;
        return sinArr[angle.toFixed(digit)];
    } else if (angle <= 270) {
        angle = angle - 180;
        return -sinArr[angle.toFixed(digit)];
    } else {
        angle = 360 - angle;
        return -sinArr[angle.toFixed(digit)];
    }
}

function sin (rad) {
    var angle = radian2angle(rad) % 360;
    if (angle < 0) { angle += 360; }
    return sin360(angle, CMath._digit);
}

function cos (rad) {
    var angle = (radian2angle(rad) + 90) % 360;
    if (angle < 0) { angle += 360; }
    return sin360(angle, CMath._digit);
}

var CMath = {
    sin: Math.sin,
    cos: Math.cos,
    atan2: Math.atan2,
}

CMath._sinArr = sinArr;
CMath._sin360 = sin360;
CMath._radian2angle = radian2angle;
CMath._calculateSinByDigit = calculateSinByDigit;

CMath._digit = 1;
calculateSinByDigit(CMath._digit);
Object.defineProperty(CMath, 'digit', {
    'get': function () { return this._digit; },
    'set': function (v) {
        if (this._digit != v) {
            this._digit = v;
            calculateSinByDigit(v);
        }
    }
});

CMath._enable = false;
Object.defineProperty(CMath, 'enable', {
    'get': function () { return this._enable; },
    'set': function (v) {
        if (this._enable != v) {
            this._enable = v;
            if (v) {
                CMath.sin = sin;
                CMath.cos = cos;
            } else {
                CMath.sin = Math.sin;
                CMath.cos = Math.cos;
            }
        }
    }
});

module.exports = CMath;
