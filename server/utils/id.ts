import crypto from 'node:crypto'

export function generateId() {
    // Create a 21 characters random id like this: bEbUn1NVCHKfMmCny4k8w
    return crypto.randomUUID().replace(/-/g, '').slice(0, 21)
}
