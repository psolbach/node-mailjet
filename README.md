# mailjet-newsletter API
This library permits to create and send newsletter campaigns using Mailjet's API in Node.js. It's MIT licensed.
Works with Node-Requests over standard http.

## Installation
Needs [Request](https://github.com/request/request), cf. package.json

## Actions
Initialize like you would with the sendemail stub.
```javascript
var Mailjet = require('mailjet-sendemail');
var mailjet = new Mailjet('apiKey', 'secretKey');
```

Then choose from a bunch of endpoints and pass in the proper options object. e.g.:
```javascript

// Create
var opts = {
  "Locale": "en_US" ,
  "SenderName": "JohnDoe",
  "SenderEmail": "john@doe.com",
  "Sender": "John Doe",
  "ContactsListID": 1234,
  "EditMode": "html",
  "Subject": "Campaign",
  "Title": "Campaign"
}

mailjet.newsletter("create", opts, error, fillHTML);

// Add Content
var opts = {
  "Text-part": "foo",
  "Html-part": "<bar>foo</bar>",
  "id": 1234
}

mailjet.newsletter("detailcontent", opts, error, respond)

// Send
var opts = {"method": "POST", "id": 1234};
mailjet.newsletter("send", opts, error, respond)
```
