#!/usr/bin/env python

from controlhandler import ControlHandler
from BaseHTTPServer import HTTPServer

import config


httpd = HTTPServer((config.HOST, config.PORT), ControlHandler)
print 'starting to serve on {}:{}'.format(config.HOST, config.PORT)
httpd.serve_forever()
