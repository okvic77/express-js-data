# express-js-data

[![Build Status](https://travis-ci.org/okvic77/express-js-data.svg?branch=master)](https://travis-ci.org/okvic77/express-js-data)

```javascript
let model = (/* some mongoose model*/)
  var bridge = new Bridge({
    data: model
  });
  app.use('/api/data', bridge.router);
```

This handle the HTTP api for [js-data](http://www.js-data.io/docs/resources).
