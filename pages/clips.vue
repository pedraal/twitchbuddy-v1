<template>
  <v-layout
    column
    justify-center
    align-center
  >
    <h1>Clips</h1>
    <section class="clip-form">
      <keep-alive>
        <v-form v-model="valid" @submit.prevent="submit">
          <v-container>
            <v-row>
              <v-col
                cols="12"
                md="4"
              >
                <v-text-field
                  v-model="channel"
                  :rules="nameRules"
                  :counter="255"
                  :error="error && error.target === 'channel'"
                  :error-messages="error && error.target === 'channel' ? error.message : ''"
                  prepend-icon="mdi-account"
                  label="Channel name"
                  required
                />
              </v-col>

              <v-col
                cols="12"
                md="4"
              >
                <v-select
                  v-model="period"
                  :items="timeSelect"
                  :error="error && error.target === 'period'"
                  :error-messages="error && error.target === 'period' ? error.message : ''"
                  label="Period"
                  required
                  prepend-icon="mdi-calendar"
                />
              </v-col>
              <v-col
                v-if="period==='custom'"
                cols="12"
                md="4"
              >
                <v-menu
                  ref="menu"
                  v-model="menu"
                  :close-on-content-click="false"
                  :return-value.sync="timerange"
                  transition="scale-transition"
                  offset-y
                  min-width="290px"
                >
                  <template v-slot:activator="{ on }">
                    <v-text-field
                      v-model="readabletimerange"
                      v-on="on"
                      :error="error && error.target === 'period'"
                      :error-messages="error && error.target === 'period' ? error.message : ''"
                      label="Date range"
                      prepend-icon="mdi-calendar-clock"
                      readonly
                    />
                  </template>
                  <v-date-picker v-model="timerange" range no-title scrollable>
                    <v-spacer />
                    <v-btn @click="menu = false" text color="primary">
                      Cancel
                    </v-btn>
                    <v-btn @click="$refs.menu.save(timerange)" text color="primary">
                      OK
                    </v-btn>
                  </v-date-picker>
                </v-menu>
              </v-col>
            </v-row>
          </v-container>
          <v-btn @click="submit" class="mb-4">
            submit
          </v-btn>
        </v-form>
      </keep-alive>
    </section>
    <section class="clip-list">
      <clip-list
        :clips="clips"
        @loadOffset="loadOffset = $event"
      />

      <div
        class="
        text-center"
      >
        <v-progress-circular
          v-if="loading"
          class="ma-4"
          indeterminate
          color="primary"
        />
      </div>
    </section>
  </v-layout>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import moment from 'moment'

import ClipList from '@/components/clips/ClipList'

const now = moment()

export default {
  components: {
    ClipList
  },
  data () {
    return {
      valid: false,
      scrollValue: 0,
      loadOffset: 0,
      menu: false,
      channel: '',
      period: 'weekly',
      periods: {
        daily: [moment(now).subtract(1, 'd').toISOString(), moment(now).toISOString()],
        weekly: [moment(now).subtract(1, 'w').toISOString(), moment(now).toISOString()],
        monthly: [moment(now).subtract(1, 'M').toISOString(), moment(now).toISOString()],
        year: [moment(now).subtract(1, 'Y').toISOString(), moment(now).toISOString()],
        all: [moment(now).subtract(15, 'y').toISOString(), moment(now).toISOString()]

      },
      timerange: [moment(now).subtract(1, 'w').format('YYYY-MM-DD'), moment(now).format('YYYY-MM-DD')],
      timeSelect: [{
        value: 'daily',
        text: 'Daily'
      }, {
        value: 'weekly',
        text: 'Weekly'
      }, {
        value: 'monthly',
        text: 'Monthly'
      }, {
        value: 'year',
        text: 'Year'
      }, {
        value: 'all',
        text: 'All'
      }, {
        value: 'custom',
        text: 'Custom'
      }],
      nameRules: [
        v => !!v || 'Name is required',
        v => v.length <= 255 || 'Name must be less than 255 characters'
      ]
    }
  },
  computed: {
    ...mapGetters('clips', ['clips', 'error', 'cursor', 'loading']),
    apitimerange () {
      let arr = [...this.timerange]
      arr = arr.sort()
      arr[0] = moment(arr[0]).hours(0).minutes(0).toISOString()
      arr[1] = moment(arr[1]).hours(23).minutes(59).toISOString()
      return arr
    },
    readabletimerange () {
      return this.apitimerange.map(t => moment(t).format('DD-MM-YYYY')).join(' / ')
    }

  },
  watch: {
    scrollValue (val) {
      if (this.cursor && !this.loading && val > this.loadOffset) {
        this.getClips()
      }
    }
  },
  beforeMount () {
    window.addEventListener('scroll', this.handleScroll)
  },
  beforeDestroy () {
    window.removeEventListener('scroll', this.handleScroll)
  },
  methods: {
    ...mapActions('clips', ['loadClips', 'emptyList', 'setCursor', 'emptyError', 'emptyList']),
    format (value) {
      return moment(value).format('DD/MM/YYYY hh:mm')
    },
    submit () {
      this.setCursor('')
      this.emptyError()
      this.emptyList()
      this.getClips()
    },
    getClips () {
      return this.loadClips({ channel: this.channel, cursor: this.cursor, start: this.periods[this.period].map(val => moment(val).toISOString())[0], end: this.periods[this.period].map(val => moment(val).toISOString())[1] })
    },
    handleScroll () {
      this.scrollValue = window.scrollY
    }
  }
}
</script>

<style lang="scss" scoped>
  section {
    width: 100%;
  }
  td {
    p{
      margin: 10px
    }
  }
</style>
