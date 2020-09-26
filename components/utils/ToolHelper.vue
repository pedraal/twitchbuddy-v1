<template>
  <v-dialog
    v-model="dialog"
    :overlay-opacity="0.8"
    max-width="600"
  >
    <template v-slot:activator="{ on, attrs }">
      <v-btn
        v-bind="attrs"
        v-on="on"
        color="grey"
        outlined
        small
        class="top-right"
      >
        {{ $t('show_help') }}
      </v-btn>
    </template>

    <v-card class="px-4 pt-8 pb-2">
      <v-card-text>
        <!-- CLIPS -->
        <template v-if="['clips', 'lang-clips'].includes($route.name)">
          <h3>{{ $t('clips.help.title') }}</h3>
          <ol class="body-2">
            <li v-for="(item,id) in $t('clips.help.steps')" :key="id">
              {{ item }}
            </li>
          </ol>
          <br>
          <h3>{{ $t('clips.help.disclaimer.title') }}</h3>
          <p
            class="body-2"
          >
            {{ $t('clips.help.disclaimer.text') }}
          </p>
        </template>

        <!-- REPLAYSYNC -->
        <template v-if="['replaysync', 'lang-replaysync'].includes($route.name)">
          <h3>{{ $t('replaysync.help.title') }}</h3>
          <h4>{{ $t('replaysync.help.subtitle1') }}</h4>
          <ol class="ml-2 body-2">
            <li v-for="(item,id) in $t('replaysync.help.steps1')" :key="id">
              {{ item }}
            </li>
          </ol>
          <br>
          <h4>{{ $t('replaysync.help.subtitle2') }}</h4>
          <ol class="ml-2 body-2">
            <li v-for="(item,id) in $t('replaysync.help.steps2')" :key="id">
              <i18n :path="`replaysync.help.steps2.${id}.text`">
                <v-btn fab class="small-btn">
                  <v-icon small>
                    {{ $t(`replaysync.help.steps2.${id}.icon`) }}
                  </v-icon>
                </v-btn>
              </i18n>
            </li>
          </ol>
          <br>
          <h3>{{ $t('replaysync.help.disclaimer.title') }}</h3>
          <ul class="body-2 text-justify">
            <li v-for="(item,id) in $t('replaysync.help.disclaimer.texts')" :key="id">
              {{ item }}
            </li>
          </ul>
        </template>
      </v-card-text>

      <v-divider />

      <v-card-actions>
        <v-spacer />
        <v-btn
          @click="dialog = false"
          color="indigo accent-3"
          text
        >
          {{ $t('close_help') }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<script>
export default {
  data () {
    return {
      dialog: false
    }
  }
}
</script>

<style lang="scss" scoped>

.small-btn {
  height: 1.5rem;
  width: 1.5rem;
  background: #555555 !important;
}
</style>
