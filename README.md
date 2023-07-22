# TiniJS Core 

The core module of the TiniJS framework.

It uses the [Lit](https://lit.dev/) library under the hood.

## Install

To manually install the module: `npm i @tinijs/core`

It is recommended to download the [Skeleton](https://github.com/tinijs/skeleton) for a ready-to-use structured project.

For more, please visit: <https://tinijs.dev>

## Usage

- Create an `app`

```ts
import {TiniComponent, App, APP_ROOT_TEMPLATE, html} from '@tinijs/core';

@App()
export class AppRoot extends TiniComponent {
  protected template = html`${APP_ROOT_TEMPLATE}`;
}
```

- Create a `component`

```ts
import {TiniComponent, Component, Input, html} from '@tinijs/core';

@Component('app-hello')
export class AppHello extends TiniComponent {
  @Input() name!: string;
  protected template = html`<h1>Hello world! 👋</h1>`;
}
```

- Create a `page`

```ts
import {TiniComponent, Page, Inject, html} from '@tinijs/core';

@Page('page-404')
export class Page404 extends TiniComponent {
  @Inject() myService!: MyService;
  protected template = html`<h1>Oops 🫣!</h1>`;
}
```

For more detail, please visit the docs: <https://tinijs.dev/docs>

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
