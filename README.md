# TiniJS Core 

> [!IMPORTANT]
> This previously experiment is wrapped up, moving forward the development will happen at <https://github.com/tinijs/tinijs/tree/main/packages/core>.
>
> If you want to use the experimental version still, please use the version `0.16.0`.

The core module of the TiniJS framework.

It uses the [Lit](https://lit.dev/) library under the hood.

## Install

To manually install the module: `npm i @tinijs/core@0.16.0`

It is recommended to download the [Skeleton](https://github.com/tinijs/skeleton) for a ready-to-use structured project.

For more, please visit: <https://tinijs.dev>

## Usage

- Create an `app` (ex. [app.ts](https://github.com/tinijs/skeleton/blob/main/app/app.ts)):

```ts
import {html} from 'lit';
import {TiniComponent, App} from '@tinijs/core';

@App()
export class AppRoot extends TiniComponent {
  protected render() {
    return html`...`;
  }
}
```

- Create a `component`:

```ts
import {html} from 'lit';
import {TiniComponent, Component, Input} from '@tinijs/core';

@Component()
export class AppHelloComponent extends TiniComponent {
  static readonly defaultTagName = 'app-hello';

  @Input() name?: string;

  protected render() {
    return html`<h1>Hello ${this.name}! 👋</h1>`;
  }
}
```

- Create a `page`:

```ts
import {html} from 'lit';
import {TiniComponent, Page} from '@tinijs/core';

@Page({
  name: 'app-page-404'
})
export class AppPage404 extends TiniComponent {
  protected render() {
    return html`<h1>Oops 🫣!</h1>`;
  }
}
```

For more detail, please visit the docs: <https://tinijs.dev>

## API

// TODO

## Developement

- Create a home for TiniJS: `mkdir TiniJS && cd TiniJS`
- Fork the repo
- Install dependencies: `cd core && npm i`
- Make changes & preview locally: `npm run build && npm pack`
- Push changes & create a PR 👌

## License

**@tinijs/core** is released under the [MIT](https://github.com/tinijs/core/blob/master/LICENSE) license.
