# Vue Doppelganger

// TODO: add the Doppelganger of Vue

## Project struture

```txt
app/
  ...
services/
  Sample1.ts
  Sample2.ts
  ...
components/
  Component1.ts
  Component2.ts
  ...
pages/
  ...

```

### App

// ...

### Components

- `MyComponent.ts`

```ts
import {TiniComponent, Component, Prop, html, css} from '@tinijs/core/vue';

// <template>
  html`
    <h1>${this.name}</h1>
  `;
// </template>

// <script lang="ts" setup>
  @Component('my-component')
  class MyComponent extends TiniComponent {

    @Prop() name = 'Mr. Anonymous';

    onCreated() {
      // component connected
    }

    onMounted() {
      // component initialized
    }

    onUnmounted() {
      // component disconnected
    }
  }
// </script>

// <style lang="scss" scoped>
  css`
    :host {
      color: green;
    }
  `;
// </style>

```

- Consume:

```html
<my-component name="John Doe"></my-component>
```

## Syntax

// ...
