# packez

`npm install --save-dev packez`

## Usage

cli

npx `packez server ./src/index.js -d dist`;

npx `packez build ./src/index.js -d dist`;

## API

```ts
const packez = require("packez");

packez(entry, output, options);

packez.build(entry, output, options);
packez.server(entry, output, options);
```

## cli

`packez [build|server] filepath [--config configPath]`

> default configPath `packez.config.js`

## configPath

```js

module.exports = function(webpackConfig) {
  ...
}

```
