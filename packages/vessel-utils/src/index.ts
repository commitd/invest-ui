
import { loggerFactory } from './logger'
export * from './qs'

loggerFactory.info('Logger initialised')

export {
    loggerFactory,
    loggerFactory as rootLogger
} 