<template>
  <v-text-field
    v-model="value.keyword"
    :label="$t('clips.keyword')"
    outlined
    dense
    rounded
    hide-details
  />
</template>

<script>
export default {
  props: {
    value: {
      type: Object,
      default: () => {
        return {}
      },
      required: true
    }
  },
  watch: {
    value () {
      this.$emit('input', this.value)
    }
  }

}
</script>
