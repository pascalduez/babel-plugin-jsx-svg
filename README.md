# babel-plugin-jsx-svg

> Tree shackable SVG aliases for JSX

## Installation

```
npm install babel-plugin-jsx-svg --save-dev
```

or

```
yarn add babel-plugin-jsx-svg --save-dev
```

## Usage

```json
{
  "plugins": ["babel-plugin-jsx-svg"]
}
```

```json
{
  "plugins": [
    [
      "babel-plugin-jsx-svg",
      {
        "elementName": "Svg",
        "elementProp": "name",
        "propertyName": "icon",
        "componentPrefix": "Svg"
      }
    ]
  ]
}
```

## Examples

```js
/* input */
import { Button } from 'somelib';

<Button icon="foo">Click me</Button>;
```

```js
/* output */
import { Button } from 'somelib';
import { SvgFoo } from 'somelib';

<Button icon={<SvgFoo />}>Click me</Button>;
```

```js
/* input */
import { Svg } from 'somelib';

<Svg name="foo" />;
```

```js
/* output */
import { SvgFoo } from 'somelib';

<SvgFoo />;
```

## options

### `elementName`

type: `String`  
default: `Svg`

### `elementProp`

type: `String`  
default: `name`

### `propertyName`

type: `String`  
default: `icon`

### `componentPrefix`

type: `String`  
default: `Svg`

## Credits

- [Pascal Duez](https://github.com/pascalduez)

## Licence

babel-plugin-jsx-svg is [unlicensed](http://unlicense.org/).

[postcss]: https://github.com/postcss/postcss
[npm-url]: https://www.npmjs.org/package/babel-plugin-jsx-svg
[npm-image]: http://img.shields.io/npm/v/babel-plugin-jsx-svg.svg?style=flat-square
[travis-url]: https://travis-ci.org/pascalduez/babel-plugin-jsx-svg?branch=master
[travis-image]: http://img.shields.io/travis/pascalduez/babel-plugin-jsx-svg.svg?style=flat-square
[codecov-url]: https://codecov.io/gh/pascalduez/babel-plugin-jsx-svg
[codecov-image]: https://img.shields.io/codecov/c/github/pascalduez/babel-plugin-jsx-svg.svg?style=flat-square
[depstat-url]: https://david-dm.org/pascalduez/babel-plugin-jsx-svg
[depstat-image]: https://david-dm.org/pascalduez/babel-plugin-jsx-svg.svg?style=flat-square
[license-image]: http://img.shields.io/npm/l/babel-plugin-jsx-svg.svg?style=flat-square
[license-url]: UNLICENSE
