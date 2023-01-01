# Angular Doppelganger

// TODO: add the Doppelganger of Angular

## Project struture

```txt
app/
  ...
services/
  service-1/
    sample-1.service.ts
  service-2/
    sample-2.service.ts
  ...
components/
  component-1/
    component-1.component.ts
    component-1.component.html
    component-1.component.scss
  component-1/
    component-2.component.ts
    component-2.component.html
    component-2.component.scss
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
import {TiniComponent, Component, Input, Reactive} from '@tinijs/core/angular';

@Component('my-component')
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
}
```

- `my-component.component.html`

```html
<h1>${this.name}</h1>
```

- `my-component.component.scss`

```scss
:host {
  color: green;
}
```

- Consume:

```html
<my-component name="John Doe"></my-component>
```

## Syntax

// ...
