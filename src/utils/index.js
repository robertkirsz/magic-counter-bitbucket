const debug = process.env.NODE_ENV !== 'production'

export const log = msg => (debug ? console.log(msg) : false)
