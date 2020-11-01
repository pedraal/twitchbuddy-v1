<template>
  <v-app>
    <v-navigation-drawer
      value
      mini-variant
      permanent
      app
    >
      <v-list>
        <v-list-item v-for="(item, i) in items" :key="i" :to="$i18n.path(item.to)" router exact>
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title />
          </v-list-item-content>
        </v-list-item>
      </v-list>

      <template v-slot:append>
        <v-list>
          <v-list-item v-for="(item, i) in footerItems" :key="i" :to="$i18n.path(item.to)" router exact>
            <v-list-item-action>
              <v-icon>{{ item.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title />
            </v-list-item-content>
          </v-list-item>
        </v-list>
      </template>
    </v-navigation-drawer>
    <v-app-bar flat app>
      <v-spacer />
      <UserMenu v-if="$store.state.api.user" />
    </v-app-bar>
    <v-content>
      <v-container class="app-container pt-6">
        <nuxt />
      </v-container>
    </v-content>
    <client-only>
      <VueHandyGa :locales="$t('vuehandyga')" class="foreground" />
    </client-only>
  </v-app>
</template>

<script>
import Cookies from 'js-cookie'
import UserMenu from '~/components/utils/UserMenu'

export default {
  name: 'DefaultLayout',
  components: {
    UserMenu
  },
  data () {
    return {
      apiLoginUrl: process.env.API_URL + '/auth/twitch',
      drawer: null,
      items: [
        {
          icon: 'mdi-view-dashboard',
          to: 'dashboard'
        },
        {
          icon: 'mdi-account-group',
          to: 'dashboard/groups'
        },
        {
          icon: 'mdi-view-list',
          to: 'dashboard/lists'
        }
      ],
      footerItems: [
        {
          icon: 'mdi-cog-outline',
          to: 'dashboard/settings'
        },
        {
          icon: 'mdi-home',
          to: ''
        }
      ]
    }
  },
  async created () {
    if (Cookies.get('tbtoken')) {
      try {
        const { data } = await this.$api.get('/me')
        this.$store.dispatch('api/setUser', data)
      } catch (error) {
        Cookies.remove('tbtoken')
      }
    }
  },
  mounted () {
    if (!Cookies.get('tbtoken')) {
      this.$router.replace(this.$store.state.locale === 'en' ? '/en/' : '/')
    }
  }
}
</script>

<style lang="scss" scoped>
.foreground {
  position: fixed;
  z-index: 4;
}

.route-name {
  text-transform: capitalize;
}

.filtered {
  filter: grayscale(100%);
  transition: all .2s ease-in-out;

  &:hover {
    filter: grayscale(0%);
  }
}
.app-container {
  max-width: 1100px;
}

.menu-item:before {
  opacity: 0 !important;
}
</style>

<style lang="scss">
.page-title {
  span:last-of-type {
   font-weight: 300;
  }
}
</style>
