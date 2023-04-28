class PermissionsDisabledError extends Error {
    constructor(message) {
        super(message)
        
        this.message = message;
        
        Object.setPrototypeOf(this, PermissionsDisabledError.prototype)
    }
}

module.exports = {
    PermissionsDisabledError
}