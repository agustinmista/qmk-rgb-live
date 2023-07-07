<template>
  <article>
    <!-- Optional header -->
    <template v-if="$slots.header">
      <header>
        <strong>
          <slot name="header"></slot>
        </strong>
      </header>
    </template>
    <!-- Content -->
    <slot></slot>
    <!-- Optional footer -->
    <template v-if="$slots.footer">
      <footer>
        <slot name="footer"></slot>
      </footer>
    </template>
  </article>
</template>