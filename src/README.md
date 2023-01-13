# Default (no doppelganger)

## Project structure

```txt
app/
  ...
services/
  sample-1.ts
  sample-2.ts
  ...
components/
  component-1.ts
  component-2.ts
  ...
pages/
  page-1/
  page-2/
  ...

```

### App

// TODO

### Components

- `my-component.ts`

```ts
import {TiniComponent, Component, Input, Reactive, html, css} from '@tinijs/core';

@TiniComponent('my-component')
class MyComponent extends TiniComponent {

  @Input() name = 'Mr. Anonymous';

  @Reactive() foo!: number;

  onCreate() {
    // component connected
  }

  onInit() {
    // component initialized
  }

  onDestroy() {
    // component disconnected
  }

  protected template = html`
    <h1>${this.name}</h1>
  `;

  static styles = css`
    :host {
      color: green;
    }

    h1 {
      margin: 0;
    }
  `;
}
```

- Consume:

```html
<my-component name="John Doe"></my-component>
```

## Syntax

// TODO
