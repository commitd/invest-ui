import * as log from 'loglevel'
const prefix = require('loglevel-plugin-prefix')
log.noConflict()

prefix.apply(log)

export default log.getLogger('root')