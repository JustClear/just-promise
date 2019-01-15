var _a = ['PENDING', 'FULFILLED', 'RESOLVED'], PENDING = _a[0], FULFILLED = _a[1], REJECTED = _a[2];
function Promise(executable) {
    var _this = this;
    this.status = PENDING;
    this.value = null;
    this.resolves = [];
    this.rejects = [];
    var resolve = function (value) {
        if (value instanceof Promise) {
            return value.then(resolve, reject);
        }
        setTimeout(function () {
            if (_this.status === PENDING) {
                _this.value = value;
                _this.status = FULFILLED;
                _this.resolves.map(function (resolve) { return resolve(); });
            }
        }, 0);
    };
    var reject = function (value) {
        setTimeout(function () {
            if (_this.status === PENDING) {
                _this.value = value;
                _this.status = REJECTED;
                _this.rejects.map(function (reject) { return reject(); });
            }
        }, 0);
    };
    try {
        executable(resolve, reject);
    }
    catch (error) {
        console.log(2);
        reject(error);
    }
}
Promise.prototype.then = function then(onfulfilled, onrejected) {
    var _this = this;
    onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : function (v) { return v; };
    onrejected = typeof onrejected === 'function' ? onrejected : function (v) { return v; };
    if (this.status === FULFILLED)
        onfulfilled(this.value);
    if (this.status === REJECTED)
        onrejected(this.value);
    if (this.status === PENDING) {
        this.resolves.push(function () { return onfulfilled(_this.value); });
        this.rejects.push(function () { return onrejected(_this.value); });
    }
    return this;
};
Promise.prototype["catch"] = function then(onrejected) {
    return this.then(null, onrejected);
};

export default Promise;
//# sourceMappingURL=just-promise.es.js.map
