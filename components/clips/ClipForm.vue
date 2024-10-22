<template>
  <v-form v-model="valid" @submit.prevent="submit">
    <v-row class="mx-2">
      <v-col
        cols="12"
        md="4"
        class="py-0"
      >
        <v-text-field
          v-model="channel"
          :rules="nameRules"
          :error="error"
          @keydown.enter="submit"
          :label="$t('clips.form.channel.label')"
          prepend-icon="mdi-account"
          name="channel"
          required
        />
      </v-col>

      <v-col
        cols="12"
        md="4"
        class="py-0"
      >
        <v-select
          v-model="period"
          :items="timeSelect"
          :error="error"
          :label="$t('clips.form.period.label')"
          name="period"
          required
          prepend-icon="mdi-calendar"
        />
      </v-col>
      <v-col
        v-if="period === 'custom'"
        cols="12"
        md="4"
        class="py-0"
      >
        <v-menu
          ref="menu"
          v-model="menu"
          :close-on-content-click="false"
          :return-value.sync="periods.custom"
          transition="scale-transition"
          offset-y
          min-width="290px"
        >
          <template v-slot:activator="{ on }">
            <v-text-field
              v-model="readabletimerange"
              v-on="on"
              :label="$t('clips.form.daterange')"
              name="daterange"
              prepend-icon="mdi-calendar-clock"
              readonly
            />
          </template>
          <v-date-picker v-model="periods.custom" range no-title scrollable>
            <v-spacer />
            <v-btn @click="menu = false" text color="primary">
              Cancel
            </v-btn>
            <v-btn @click="$refs.menu.save(periods.custom)" text color="primary">
              OK
            </v-btn>
          </v-date-picker>
        </v-menu>
      </v-col>
      <v-col
        cols="12"
        md="4"
        class="py-0"
      >
        <v-btn @click="submit" class="mb-6 mb-md-0 mt-md-4">
          {{ $t('clips.form.submit') }}
        </v-btn>
      </v-col>
    </v-row>
  </v-form>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'
const now = moment()

export default {
  data () {
    return {
      valid: false,
      channel: '',
      period: 'weekly',
      periods: {
        daily: [moment(now).subtract(1, 'd').toISOString(), moment(now).toISOString()],
        weekly: [moment(now).subtract(1, 'w').toISOString(), moment(now).toISOString()],
        monthly: [moment(now).subtract(1, 'M').toISOString(), moment(now).toISOString()],
        year: [moment(now).subtract(1, 'Y').toISOString(), moment(now).toISOString()],
        all: [moment(now).subtract(15, 'y').toISOString(), moment(now).toISOString()],
        custom: [moment(now).subtract(1, 'w').format('YYYY-MM-DD'), moment(now).format('YYYY-MM-DD')]
      },
      menu: false,
      timeSelect: [{
        value: 'daily',
        text: this.$t('clips.form.period.daily')
      }, {
        value: 'weekly',
        text: this.$t('clips.form.period.weekly')
      }, {
        value: 'monthly',
        text: this.$t('clips.form.period.monthly')
      }, {
        value: 'year',
        text: this.$t('clips.form.period.yearly')
      }, {
        value: 'all',
        text: this.$t('clips.form.period.all')
      }, {
        value: 'custom',
        text: this.$t('clips.form.period.custom')
      }],
      nameRules: [
        v => !!v || this.$t('clips.form.channel.required'),
        v => v.length <= 255 || this.$t('clips.form.channel.toolong')
      ]
    }
  },
  computed: {
    ...mapGetters('clips', ['error', 'cursor']),
    apitimerange () {
      let arr = [...this.periods[this.period]]
      arr = arr.sort()
      arr[0] = moment(arr[0]).hours(0).minutes(0).toISOString()
      arr[1] = moment(arr[1]).hours(23).minutes(59).toISOString()
      return arr
    },
    readabletimerange () {
      return this.apitimerange.map(t => moment(t).format('DD-MM-YYYY')).join(' / ')
    },
    start_at () {
      return this.periods[this.period].map(val => moment(val).toISOString())[0]
    },
    end_at () {
      return this.periods[this.period].map(val => moment(val).toISOString())[1]
    }
  },
  methods: {
    ...mapActions('clips', ['loadClips', 'emptyList', 'setCursor', 'emptyError', 'emptyList']),
    format (value) {
      return moment(value).format('DD/MM/YYYY hh:mm')
    },
    submit () {
      this.keyword = ''
      this.setCursor('')
      this.emptyError()
      this.emptyList()
      this.getClips()
    },
    getClips () {
      return this.loadClips({ channel: this.channel, cursor: this.cursor, start: this.apitimerange[0], end: this.apitimerange[1] })
    }
  }
}
</script>
