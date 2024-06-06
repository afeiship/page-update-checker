# page-update-checker
> A lightweight, self-contained JavaScript module for real-time webpage update detection and user notification.

[![version][version-image]][version-url]
[![license][license-image]][license-url]
[![size][size-image]][size-url]
[![download][download-image]][download-url]

> [!NOTE]
> The url should be a public accessible url, no cacheable content.

## installation
```shell
npm install @jswork/page-update-checker
```

## usage
```js
import PageUpdateChecker from '@jswork/page-update-checker';

const checker = PageUpdateChecker.run({
  url: 'https://afeiship.github.io/page-update-checker',
  interval: 1000 * 60 * 1, // 1 minutes
  onUpdateAvailable: () => {
    const confirmed = window.confirm('网页内容已经更新，你是否现在刷新？');
    if (confirmed) {
      window.location.reload();
    } else {
      this.ignore();
    }
  }
});

// trigger ingore events;
window.dispatchEvent(new CustomEvent('@:page-update-checker:ignore'));
// use nx
nx.rootDispatch('@:page-update-checker:ignore');
```

## license
Code released under [the MIT license](https://github.com/afeiship/page-update-checker/blob/master/LICENSE.txt).

[version-image]: https://img.shields.io/npm/v/@jswork/page-update-checker
[version-url]: https://npmjs.org/package/@jswork/page-update-checker

[license-image]: https://img.shields.io/npm/l/@jswork/page-update-checker
[license-url]: https://github.com/afeiship/page-update-checker/blob/master/LICENSE.txt

[size-image]: https://img.shields.io/bundlephobia/minzip/@jswork/page-update-checker
[size-url]: https://github.com/afeiship/page-update-checker/blob/master/dist/index.min.js

[download-image]: https://img.shields.io/npm/dm/@jswork/page-update-checker
[download-url]: https://www.npmjs.com/package/@jswork/page-update-checker
