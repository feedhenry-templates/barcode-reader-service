# Barcode Lookup

This service looks up a barcode by UPC id. It connects with a SOAP service, takes a mixed SOAP and CSV response, and returns JSON back to the client, more effectively mobilising the service.

# Group Barcode API

# Recent Searches [/barcode/recent]

'List recent searches' endpoint.

## barcode/recent [GET]

'List recent searches' endpoint.

+ Response 200 (application/json)
    + Body
            [
              "Array of recent barcode searches"
            ]


# Read Barcode [/barcode/read]

'Read Barcode' endpoint.

## barcode/read [POST]

'Read Barcode' endpoint.

+ Request (application/json)
    + Body
            {
              "barcode": "9780201896831"
            }

+ Response 200 (application/json)
    + Body
            [
              "Some product data goes here"
            ]
