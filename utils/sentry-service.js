const Sentry = require('@sentry/node')

Sentry.init({
  dsn: process.env.SENTRY_URL,
  tracesSampleRate: 1.0
})

// const transaction = Sentry.startTransaction({
//   op: 'test',
//   name: 'My First Test Transaction'
// })

module.exports = { Sentry }
