# loc-i18next
## Introduction

A replicate of [jquery-i18next](https://github.com/i18next/jquery-i18next) module (which is great by the way!), intended for use without jquery.

## Comparaison with `jquery-i18next`
jquery-i18next plugin :

```js
jqueryI18next.init(i18nextInstance, $);
$(".nav").localize();
```

loc-i18next :

```js
localize = locI18next.init(i18next);
localize(".nav");
```
## Initialize the plugin

*With options :*
```js
import i18next from 'i18next';
import locI18next from "loc-i18next";

const localize = locI18next.init(i18next, {
  selectorAttr: 'data-i18n', // selector for translating elements
  targetAttr: 'i18n-target',
  optionsAttr: 'i18n-options',
  useOptionsAttr: false,
  parseDefaultValueFromContent: true
  document: window.document,
});
```
*Using default values :*
```js
import i18next from 'i18next';
import locI18next from "loc-i18next";

const localize = locI18next.init(i18next);
```

## Using options in translation function

```js
<a id="btn1" href="#" data-i18n="myKey"></a>
localize("#btn1", options);
```

or

```js
<a id="btn1" href="#" data-i18n="myKey" i18n-options="{ 'a': 'b' }"></a>
localize("#btn1");
```

## Usage of selector function

### translate an element

```js
<a id="btn1" href="#" data-i18n="myKey"></a>
localize("#btn1", options);
```

myKey: same key as used in i18next (optionally with namespaces)
options: same options as supported in i18next.t

### translate children of an element

```js
<ul class="nav">
  <li><a href="#" data-i18n="nav.home"></a></li>
  <li><a href="#" data-i18n="nav.page1"></a></li>
  <li><a href="#" data-i18n="nav.page2"></a></li>
</ul>
localize(".nav");
```

### translate some inner element
```js
<div class="outer" data-i18n="ns:key" data-i18n-target=".inner">
  <input class="inner" type="text"></input>
</div>
localize(".outer");
```

### set different attribute
```js
<a id="btn1" href="#" data-i18n="[title]key.for.title"></a>
localize("#btn1");
```

### set multiple attributes
```js
<a id="btn1" href="#" data-i18n="[title]key.for.title;myNamespace:key.for.text"></a>
localize("#btn1");
```

### set innerHtml attributes
```js
<a id="btn1" href="#" data-i18n="[html]key.for.title"></a>
localize("#btn1");
```

### prepend content
```js
<a id="btn1" href="#" data-i18n="[prepend]key.for.title">insert before me, please!</a>
localize("#btn1");
```

### append content
```js
<a id="btn1" href="#" data-i18n="[append]key.for.title">append after me, please!</a>
localize("#btn1");
```

### set as an attribute
```js
<a id="btn1" href="#" data-i18n="[data-someNameAttribute]key.for.content"></a>
localize("#btn1");
```

### use a custom `document` object
```js
<template id="template">
  <a id="btn1" href="#" data-i18n="myKey"></a>
</template>
const shadowRoot = document.body.attachShadow();
const template = document.getElementById("template");
shadowRoot.appendChild(template.content.cloneNode(true));
localize("#btn1", {document: shadowRoot});
```

## Motivation
- Having an occasion to try some packages like rollup, babel or uglify.
- Obtaining the same kind of functionnalities than with `jquery-i18next` in a project not using jquery.


## Project actively using `loc-i18next`
- [Magrit](https://github.com/riatelab/magrit) : [http://magrit.cnrs.fr/](http://magrit.cnrs.fr/)


## Blog posts about using `loc-i18next`
- [https://code.tutsplus.com/tutorials/translating-stimulus-apps-with-i18next--cms-30770](https://code.tutsplus.com/tutorials/translating-stimulus-apps-with-i18next--cms-30770)
- [https://phraseapp.com/blog/posts/localizing-stimulusjs-i18next/](https://phraseapp.com/blog/posts/localizing-stimulusjs-i18next/)
