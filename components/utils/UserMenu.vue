<template>
  <v-menu>
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        text
        class="pa-2"
        dense
      >
        <span class="mr-3">
          {{ $store.state.api.user.displayName }}
        </span>
        <v-avatar size="30">
          <v-img :src="$store.state.api.user.avatarUrl" />
        </v-avatar>
      </v-btn>
    </template>
    <v-list flat>
      <v-list-item @click="logout" dense>
        <v-list-item-title>{{ $t('user.logout') }}</v-list-item-title>
      </v-list-item>
    </v-list>
  </v-menu>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  methods: {
    logout () {
      this.$api.get('/logout').then(() => {
        Cookies.remove('tbtoken')
        window.location = '/'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.v-menu__content {
  margin-top: -4px;

  .v-list-item {
    min-height: 25px !important;
  }
}
</style>
