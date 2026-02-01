<script setup>
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
</script>

<template>
  <footer class="py-8 px-4 border-t border-gray-200 dark:border-gray-700 mt-16">
    <div class="container mx-auto text-center text-gray-600 dark:text-gray-400 text-sm">
      {{ t('footer.copy') }}
    </div>
  </footer>
</template>
