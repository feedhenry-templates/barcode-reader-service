var express = require('express');
var bodyParser = require('body-parser');
var request = require('request')
var jsdom = require('jsdom')
var cors = require('cors');
var soap = require('soap');
var csv = require('csv');

var accessToken = process.env.ACCESS_TOKEN || '924646BB-A268-4007-9D87-2CE3084B47BC';

function barcodeRoute() {
  var barcode = new express.Router();
  barcode.use(cors());
  barcode.use(bodyParser());

  barcode.get('/recent', function(req, res) {
    // Request the searchupc.com home page. It contains a list of current searches.
    request({
      url : 'http://www.searchupc.com/',
      method : 'get',
      followAllRedirects : true
    }, function(err, response, body){
      if (err){
        console.error(err);
        return;
      }
      // Add jQuert to the response so we can easily access elements in the page
      jsdom.env(body,["http://code.jquery.com/jquery.js"], function (errors, window) {
        var $ = window.$;
        var currentSearches = [];
        // The span with id 'currentsearches' contains a list of <a> tags which have the current searches
        $('#currentsearches').children('a').each(function () {
          console.log('this = ', this.innerHTML);
          // Iterate over each child element of type <a> and store the value in the currentSearches array
          currentSearches.push(this.innerHTML)
        });
        return res.json(currentSearches);
      });
    });
  });

  barcode.post('/read', function(req, res) {
    var barcode = req.query.barcode || req.body.barcode;
    var wsdlUrl = 'http://www.searchupc.com/service/UPCSearch.asmx?wsdl';
    // this will lookup the WSDL, and create a client with functions for every exposed endpoint
    soap.createClient(wsdlUrl, function(err, soapClient){
      if (err) return res.status(500).json(err);
      // one of these exposed entpoints was called GetProduct
      soapClient.GetProduct({
        upc : barcode,
        accesstoken : accessToken
      }, function(err, result){
        if (err) return res.status(500).json(err);
        // now we have the response, but the webservice returns it as a CSV string. Let's use the parser
        var responseAsCsv = result.GetProductResult;
        csv.parse(responseAsCsv, {columns : true}, function(err, parsedResponse){
          if (err) return res.status(500).json(err);
          // finally, we're ready to return this back to the client.
          return res.json(parsedResponse);
        })
      });

    });
  });

  return barcode;
}

module.exports = barcodeRoute;
