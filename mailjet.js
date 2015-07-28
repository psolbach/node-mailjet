/*
 MAILJET API v3 Node Bindings
 Author: PS, dpa-newslab
*/

var http = require('http')
  , request = require('request')
  , querystring = require('querystring')
  , mail_parser = require('./mail-parser');


// Initialization class
var Mailjet = function(apiKey, secretKey) {
  this._apiKey = apiKey;
  this._secretKey = secretKey;
  this._authenticate = new Buffer(apiKey + ':' + secretKey)
    .toString('base64');
};

Mailjet.prototype = {
  getOptions: function(endpoint, method) {
    return {
      url: "http://api.mailjet.com" + endpoint,
      method: method, json: true, headers: {
        'Authorization': 'Basic ' + this._authenticate,
        'Content-Type': 'application/x-www-form-urlencoded',
        'Content-Length': 0
      }
    };
  },

  makeRequest: function(options, callback) {
    var result = ""

    var req = request(options, function(err, res, body) {
        callback(body)
    });

    // Checking errors
    req.on('error', function(e) {
      console.log('problem with request: ' + e.message);
    })

    // Request
    return req
  },

  contactLists: function(error, callback) {
    var endpoint = "/v3/REST/contactslist"
      , options = this.getOptions(endpoint, "GET");

    // contactLists API request
    req = this.makeRequest(options, callback).end();
  },

  listRecipients: function(listname, error, callback) {
    var endpoint = "/v3/REST/listrecipient?Listname="+listname
      , options = this.getOptions(endpoint, "GET");

    // listRecipients API request
    req = this.makeRequest(options, callback).end();
  },

  newsletter: function(action, opts, error, callback) {

    /*
      Actions:
      "detailcontent", "send", "test"
      "create" => Create Newsletter, return ID
    */  
    
    var customUrl = (opts.id != undefined) ? "/" + opts.id.toString() : "";
    customUrl += (action != "create" && action != "list") ? "/" + action : "";
    if (opts.Filter) customUrl = opts.Filter

    var endpoint = "/v3/REST/newsletter" + customUrl
      , options = this.getOptions(endpoint, opts.method || "POST")
      , data = opts;

    // Strip & prepare payload
    delete data.id; delete data.method;
    data = JSON.stringify(data);

    // Are we POSTing?
    var isPost = options.method == "POST"
    
    options.headers['Content-Type'] = "application/json; charset=UTF-8";
    options.headers['Content-Length'] = isPost ? Buffer.byteLength(data) : 0;

    // Fire API request
    // console.log(options); return;
    req = this.makeRequest(options, callback);
    if (data && isPost) req.write(data, "utf8");
    req.end();
  },

  sendContent: function(from, to, subject, type, content) {
    if (arguments.length < 4) throw new Error('Missing required argument');
    if (typeof(to) == 'string') to = [to];

    // Neatly ordered recipients
    var recipients = mail_parser.parse_recipient_type(to);

    // Build the POST body
    if (type != 'html' && type != 'text') {
      throw new Error('Wrong email type');
    }

    var body = {
      from: from,
      // Handle many destinations
      to: recipients['to'].join(', '),
      cc: recipients['cc'].join(', '),
      bcc: recipients['bcc'].join(', '),
      subject: subject
    }

    // HTML or Text?
    key = type == 'html' ? "html" : "text", body[key] = content;
    body = querystring.stringify(body);

    var endpoint = "/v3/send/"
    , options = this.getOptions(endpoint, "POST");
    options.headers['Content-Length'] = Buffer.byteLength(body)

    // Mail Send API request
    req = this.makeRequest(options, function(){})

    // Send the body
    req.end(body);
  }

}

module.exports = Mailjet;
