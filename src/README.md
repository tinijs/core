# Default (no doppelganger)

## Project struture

```txt
app/
  ...
services/
  sample-1.service.ts
  sample-2.service.ts
  ...
components/
  component-1.component.ts
  component-2.component.ts
  ...
pages/
  page-1/
  page-2/
  ...

```

### App

// ...

### Components

- `my-component.component.ts`

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
  `;
}
```

- Consume:

```html
<my-component name="John Doe"></my-component>
```

## Syntax

// ...
