# Savings Calculator

## Run project locally
```js
npm install && npm start
```

## How to mount

1. Build static assets
```js 
npm install && npm run build
```

2. Upload static assets into static address

3. Load calculator into any desired frontend:

Place this in html head
```html
<link rel="stylesheet" type="text/css" href="<link-to-your-static-css">
<script defer src="https://use.fontawesome.com/releases/v5.0.6/js/all.js"></script>
```

Place this in bottom of html body
```html
<script
    src="<link-to-your-static-js>"
    mountNode="<id-of-dom-node-to-mount-on>"
    lan="<language-choice>"
></script>
<!-- 
default values:
    mountNode: 'savings-calculator'
    lan: 'en'
-->
```