#!/usr/bin/env python3

from controlhandler import ControlHandler
from http.server import HTTPServer


import config


httpd = HTTPServer((config.HOST, config.PORT), ControlHandler)
print("starting to serve on {}:{}".format(config.HOST, config.PORT))
httpd.serve_forever()
