import json
import cgi
import requests
from http.server import BaseHTTPRequestHandler


import config
import nodes
import jobs

import urllib3

urllib3.disable_warnings()


class ControlHandler(BaseHTTPRequestHandler):
    def do_POST(self):
        if self.path == "/control/nodes":
            self.handle_nodes()
        elif self.path == "/control/jobs":
            self.handle_jobs()
        elif self.path == "/control/logs":
            self.handle_logs()
        elif self.path == "/control/jobscripts":
            self.handle_jobscripts()
        else:
            self.send_error(404)

    def handle_jobs(self):
        if not self.current_user:
            self.send_error(403, "You are not logged in")
            return

        try:
            jobs.test(self.jobs, self.current_user, self.is_admin())
        except OSError as err:
            self.send_error(
                500,
                "OSError: {} (while testing job definition `{}`".format(err, self.jobs),
            )
            return
        except RuntimeError as err:
            self.send_error(500, "Invalid job query: `{}`. {}".format(self.jobs, err))
            return

        try:
            if self.is_admin():
                output = jobs.control(self.action, self.jobs, payload=self.payload)
            else:
                output = jobs.control(
                    self.action, self.jobs, payload=self.payload, user=self.current_user
                )

        except OSError as err:
            command_str = " ".join(jobs.command(self.action, self.jobs))
            self.send_error(
                500, "OSError: {} (while running `{}`)".format(err, command_str)
            )
            return
        except RuntimeError as err:
            command_str = " ".join(jobs.command(self.action, self.jobs))
            self.send_error(
                500, "Error while running `{}`: {}".format(command_str, err)
            )
            return

        self.send_response(200)
        self.end_headers()
        self.wfile.write(output)

    def handle_nodes(self):
        if not self.is_admin():
            self.send_error(403, "You are no admin")
            return

        try:
            nodes.test(self.nodes)
        except OSError as err:
            self.send_error(
                500,
                "OSError: {} (while testing node definition `{}`".format(
                    err, self.nodes
                ),
            )
            return
        except RuntimeError as err:
            self.send_error(
                500, "Invalid node definition: `{}`. {}".format(self.nodes, err)
            )
            return

        try:
            output = nodes.control(self.action, self.nodes)
        except OSError as err:
            command_str = " ".join(nodes.command(self.action, self.nodes))
            self.send_error(
                500, "OSError: {} (while running `{}`)".format(err, command_str)
            )
            return
        except RuntimeError as err:
            command_str = " ".join(nodes.command(self.action, self.nodes))
            self.send_error(
                500, "Error while running `{}`: {}".format(command_str, err)
            )
            return

        self.send_response(200)
        self.end_headers()
        self.wfile.write(output)

    def handle_logs(self):
        if not self.current_user:
            self.send_error(403, "You are not logged in")
            return

        try:
            for job in self.jobs:
                jobs.test(str(job), self.current_user, self.is_admin())
        except OSError as err:
            self.send_error(
                500,
                "OSError: {} (while testing job definition `{}`".format(err, self.jobs),
            )
            return
        except RuntimeError as err:
            self.send_error(500, "Invalid job query: `{}`. {}".format(self.jobs, err))
            return

        try:
            user = None if self.is_admin() else self.current_user
            lines = self.params["lines"] if "lines" in self.params else None
            output = [jobs.log(job, lines=lines, user=user) for job in self.jobs]

        except OSError as err:
            self.send_error(500, "OSError: {} while reading job logs".format(err))
            return
        except RuntimeError as err:
            self.send_error(500, "RuntimeError {} while reading job logs".format(err))
            return

        self.send_response(200)
        self.end_headers()
        self.wfile.write(json.dumps(output).encode())

    def handle_jobscripts(self):
        if not self.current_user:
            self.send_error(403, "You are not logged in")
            return

        try:
            for job in self.jobs:
                jobs.test(str(job), self.current_user, self.is_admin())
        except OSError as err:
            self.send_error(
                500,
                "OSError: {} (while testing job definition `{}`".format(err, self.jobs),
            )
            return
        except RuntimeError as err:
            self.send_error(500, "Invalid job query: `{}`. {}".format(self.jobs, err))
            return

        try:
            user = None if self.is_admin() else self.current_user
            output = [jobs.jobscript(job, user=user) for job in self.jobs]

        except OSError as err:
            self.send_error(500, "OSError: {} while reading job logs".format(err))
            return
        except RuntimeError as err:
            self.send_error(500, "RuntimeError {} while reading job logs".format(err))
            return

        self.send_response(200)
        self.end_headers()
        self.wfile.write(json.dumps(output).encode())

    def do_OPTIONS(self):
        self.send_response(200)
        self.send_header("Access-Control-Allow-Methods", "POST, OPTIONS")
        self.send_header(
            "Access-Control-Allow-Headers", "X-Requested-With, Content-Type"
        )
        self.end_headers()

    def end_headers(self):
        self.send_header("Access-Control-Allow-Origin", "*")
        BaseHTTPRequestHandler.end_headers(self)

    def is_admin(self):
        authentication = self.authenticate()
        if not authentication:
            return False

        if not config.ADMIN_GROUP in authentication["decoded"]["groups"]:
            return False

        return True

    @property
    def current_user(self):
        authentication = self.authenticate()
        if not authentication:
            return None

        return authentication["decoded"]["login"]

    def authenticate(self):
        if self._authentication:
            return self._authentication
        authentication = self.auth_token
        if not authentication:
            self.send_error(403, "No authentication data sent")
            return None

        data = {"token": authentication}
        response = requests.post(config.AUTH_URL, data=data, verify=False)

        status = response.status_code
        content = response.content

        if status != 200:
            self.send_error(status, content)
            return None

        try:
            authentication = json.loads(content)
        except:
            self.send_error(500, "Could not parse authentication response")
            return None

        if "valid" not in authentication or not authentication["valid"]:
            self.send_error(403, "Invalid authentication")

        if "decoded" not in authentication or not authentication["decoded"]:
            self.send_error("Authentication is missing information")

        decoded = authentication["decoded"]
        for key in ["name", "groups", "home", "login", "uid"]:
            if key not in decoded or not decoded[key]:
                self.send_error("Authentication is missing {} key".format(key))

        self._authentication = authentication
        return authentication

    @property
    def params(self):
        if self._params:
            return self._params

        ctype, pdict = cgi.parse_header(self.headers["content-type"])
        if ctype == "multipart/form-data":
            self._params = cgi.parse_multipart(self.rfile, pdict)
        elif ctype == "application/x-www-form-urlencoded":
            length = int(self.headers["content-length"])
            self._params = cgi.parse_qs(self.rfile.read(length), keep_blank_values=1)
        elif ctype == "application/json":
            length = int(self.headers["content-length"])
            self._params = json.loads(self.rfile.read(length))
        else:
            self._params = {}

        return self._params

    @property
    def auth_token(self):
        authentication = None

        if not authentication:
            authentication = self.headers["authentication"]
        if not authentication:
            if "authentication" in self.params:
                authentication = self.params["authentication"]

        return authentication

    @property
    def action(self):
        return self.params["action"]

    @property
    def nodes(self):
        if "nodes" in self.params:
            return self.params["nodes"]
        return None

    @property
    def jobs(self):
        if "jobs" in self.params:
            return self.params["jobs"]
        return None

    @property
    def payload(self):
        if "payload" in self.params:
            return self.params["payload"]
        return None

    error_message_format = 'Error %(code)d (%(explain)s): "%(message)s"'
    error_content_type = "text/plain"
    _params = None
    _authentication = None
