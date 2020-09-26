<template>
  <v-row align="center" justify="center" style="min-height: 80vh;">
    <v-col
      cols="12"
      sm="8"
      md="6"
      lg="5"
      xl="4"
      class="text-center text-md-left"
    >
      <h2 class="display-1 font-weight-bold">
        {{ $t('home.pretitle') }}
      </h2>
      <h1 class="display-3 font-weight-bold">
        TwitchBuddy
      </h1>
      <p class="body-1 font-weight-thin my-1">
        {{ $t('home.subtitle') }}
      </p>
      <p class="headline mt-2 mb-0">
        {{ $t('home.presentation') }}
      </p>
    </v-col>
    <v-col
      cols="12"
      sm="8"
      md="5"
    >
      <v-row justify="center">
        <v-col v-for="item in items" :key="item.title" cols="12" class="ma-4">
          <v-card class="px-4">
            <v-card-title class="pb-0 pt-8">
              <h2 class="mx-auto headline">
                <v-icon class="mb-2">
                  {{ item.icon }}
                </v-icon>&nbsp;{{ item.title }}
              </h2>
            </v-card-title>
            <v-card-text class="pa-4 text-justify">
              {{ item.content }}
            </v-card-text>
            <v-card-actions class="text-center">
              <v-badge
                :value="!!item.badge"
                class="d-block mx-auto"
                color="error"
                offset-x="20px"
                offset-y="10px"
              >
                <template v-if="item.badge" v-slot:badge>
                  <span class="px-1 badge">{{ item.badge }}</span>
                </template>
                <v-btn
                  :to="item.link"
                  nuxt
                  class="mx-auto mb-4"
                  color="indigo accent-1"
                  outlined
                >
                  {{ $t('home.action') }}
                </v-btn>
              </v-badge>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-col>
  </v-row>
</template>

<script>

export default {
  transition: 'page',
  data () {
    return {
      items: [
        {
          title: 'Clips',
          icon: 'mdi-movie-open-outline',
          content: this.$t('home.clips'),
          link: this.$i18n.path('clips'),
          badge: false
        },
        {
          title: 'Replay sync',
          icon: 'mdi-filmstrip',
          content: this.$t('home.replaysync'),
          link: this.$i18n.path('replaysync'),
          badge: 'beta'
        }
      ]
    }
  }
}
</script>

<style lang="scss" scoped>
  h1 {
    text-shadow: -3px 4px #536dfe;
  }

  .v-card .v-card__title .v-icon {
    text-shadow: -2px 3px #536dfe;
  }

  .badge {
    text-transform: uppercase;
    font-weight: 400;
    letter-spacing: 2px;
  }
</style>
