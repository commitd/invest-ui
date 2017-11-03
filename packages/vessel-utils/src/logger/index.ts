import * as loglevel from 'loglevel'

loglevel.noConflict()

// Though nice to have a prefix, if you enable prefix you will loose the location of the logging
// const prefix = require('loglevel-plugin-prefix')
// prefix.apply(loglevel)

/** A factory from which you can use directly or craete new loggers from */
export const loggerFactory = loglevel.getLogger('root')
