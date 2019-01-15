const [PENDING, FULFILLED, REJECTED] = ['PENDING', 'FULFILLED', 'RESOLVED']

export default function Promise(executable: (resolve: (value: any) => void, reject: (value: any) => void) => void): void {
    this.status = PENDING
    this.value = null
    this.resolves = []
    this.rejects = []

    const resolve = (value: any) => {
        if (value instanceof Promise) {
            return value.then(resolve, reject)
        }
        setTimeout(() => {
            if (this.status === PENDING) {
                this.value = value
                this.status = FULFILLED
                this.resolves.map((resolve: () => any) => resolve())
            }
        }, 0);
    }

    const reject = (value: any) => {
        setTimeout(() => {
            if (this.status === PENDING) {
                this.value = value
                this.status = REJECTED
                this.rejects.map((reject: () => any) => reject())
            }
        }, 0);
    }

    try {
        executable(resolve, reject)
    } catch (error) {
        console.log(2);
        
        reject(error)
    }
}

Promise.prototype.then = function then(onfulfilled: (value: any) => any | null, onrejected: (value: any) => any): any {
    onfulfilled = typeof onfulfilled === 'function' ? onfulfilled : v => v
    onrejected = typeof onrejected === 'function' ? onrejected : v => v

    if (this.status === FULFILLED) onfulfilled(this.value)
    if (this.status === REJECTED) onrejected(this.value)
    if (this.status === PENDING) {
        this.resolves.push(() => onfulfilled(this.value))
        this.rejects.push(() => onrejected(this.value))
    }

    return this;
}

Promise.prototype.catch = function then(onrejected: (value: any) => any): any {
    return this.then(null, onrejected)
}