
import * as loglevel from 'loglevel'
// If you enable prefix you will loose the location of the logging
// const prefix = require('loglevel-plugin-prefix')

loglevel.noConflict()
// prefix.apply(loglevel)

export const rootLogger = loglevel.getLogger('root')
