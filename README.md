# express-js-data

[![Build Status](https://travis-ci.org/okvic77/express-js-data.svg?branch=master)](https://travis-ci.org/okvic77/express-js-data)

```javascript
  var bridge = new Bridge({
    users: UserModel,
    otherModel: OtherModel
  });
  app.use('/api/data', bridge.router);
```

This handle the HTTP api for [js-data](http://www.js-data.io/docs/resources).
