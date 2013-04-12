# TxServer

A modular transaction meta server. Simplifies the process of merging multiple independent services
into a single running instance.


## Configuration

~~~javascript

ns.vaSubserviceSettings = [
	{
		s            : 'service-name',
		sflHandler   : 'file-location-of-object-which-will-handle-subservice'
		aConfig      : {
		   param1: value1,
		   ...
		},
		aRouteDefaults : {
				nPort          : 1234
				reRestPath     : regular-expression-for-rest-path
				httpmethod     : "get",
				fHandlerMethod : "fSomeMethod"
		},
		vaRoute : [
			{
				nPort          : 4567
				reRestPath     : regular-expression-for-rest-path
				httpmethod     : "get",
				fHandlerMethod : "fSomeMethod"
			},
			{
				httpmethod     : "post",
				fHandlerMethod : "fSomeOtherMethod"
			}			
		]
	}
];


module.exports = ns;

~~~

## License

The MIT License (MIT)

Copyright (c) 2013 Jeremy S. De Bonet

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

