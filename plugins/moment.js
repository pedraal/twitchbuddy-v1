import moment from 'moment'

export default function (ctx, inject) {
  // Inject to context as $api
  inject('moment', moment)
}
