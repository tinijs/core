# TiniJS Core 

The core module of the TiniJS framework.

It uses the [Lit](https://lit.dev/) library under the hood.

## Install

To manually install the module: `npm i @tinijs/core`

It is recommended to download the [Skeleton](https://github.com/tinijs/skeleton) for a ready-to-use structured project.

For more, please visit: <https://tinijs.dev> (TODO)

## Usage

- Create an `app` (ex. [app.ts](https://github.com/tinijs/skeleton/blob/main/app/app.ts)):

```ts
import {TiniComponent, App, html} from '@tinijs/core';

@App()
export class AppRoot extends TiniComponent {
  protected render() {
    return html`...`;
  }
}
```

- Create a `component`:

```ts
import {TiniComponent, Component, Input, html} from '@tinijs/core';

export const APP_HELLO = 'app-hello';
@Component()
export class AppHelloComponent extends TiniComponent {
  static readonly defaultTagName = APP_HELLO;

  @Input() name!: string;

  protected render() {
    return html`<h1>Hello ${this.name}! 👋</h1>`;
  }
}
```

- Create a `page`:

```ts
import {TiniComponent, Page, html} from '@tinijs/core';

@Page({
  name: 'app-page-404'
})
export class AppPage404 extends TiniComponent {
  protected render() {
    return html`<h1>Oops 🫣!</h1>`;
  }
}
```

For more detail, please visit the docs: <https://tinijs.dev/docs> (TODO)

## API

// TODO

## Developement

- Create a home for TiniJS: `mkdir TiniJS && cd TiniJS`
- Fork the repo: `git clone https://github.com/tinijs/core.git`
- Install dependencies: `cd core && npm i`
- Make changes & preview locally: `npm run build && npm pack`
- Push changes & create a PR 👌

## License

**@tinijs/core** is released under the [MIT](https://github.com/tinijs/core/blob/master/LICENSE) license.
