#!/usr/bin/env python2

import urllib3
urllib3.disable_warnings()
import requests
import logging
import re

import json
import sys

RACKS = {
    1: {
        "ip": "10.10.214.101",
        "name": "C50.240_Rack1-2 (Mainsim)",
        "shortname": "Rack1-2"
    },
    2: {
        "ip": "10.10.214.102",
        "name": "C50.240_Rack3-4 (Enssim)",
        "shortname": "Rack3-4"
    },
    3: {
        "ip": "10.10.214.103",
        "name": "C50.240_Rack5-6 (leer)",
        "shortname": "Rack5-6"
    }
}

VALUE_MAPPING = {
    'alar1002': '1',
    'alarm100': '1',
    'alarm101': '1',
    'alarm102': '1',
    'alarm103': '1',
    'alarm104': '1',
    'alarm105': '1',
    'alarm200': '1',
    'alarm201': '1',
    'alarm202': '1',
    'alarm203': '1',
    'alarm204': '1',
    'alarm205': '1',
    'alarm206': '1',
    'alarm207': '1',
    'alarm208': '1',
    'alarm209': '1',
    'alarm210': '1',
    'alarm211': '1',
    'alarm212': '1',
    'alarm213': '1',
    'alarm400': '1',
    'alarm402': '1',
    'alarm700': '1',
    'alarm701': '1',
    'alarm80': '1',
    'val0': ("fan_running", lambda v: v == "ON"),
    'val1': ("fan_speed", int),
    'val2': ("return_air", float),
    'val3': ("return_water", float),
    'val5': ("cooling_capacity", float),
    'val6': ("valve_position", int),
    'val7': ("supply_air", float),
    'val9': ("supply_water", float),
    'val11': ("water_flow", float),
    'val18': "21.9",
    'val19': ("supply_air", float),
    'val20': ("valve_position_redundant", int)
}


def translate_value(values_dict, key, value):
    if key in VALUE_MAPPING:
        if type(VALUE_MAPPING[key]) == tuple:
            mapped_key, mapping = VALUE_MAPPING[key]
            values_dict[mapped_key] = mapping(value)


class Rack(object):
    def __init__(self, number=0):
        self.number = number
        self.ip = RACKS[number]["ip"]
        self.name = RACKS[number]["name"]
        self.shortname = RACKS[number]["shortname"]
        self.cookie = None

    def url(self, action):
        url = "https://{self.ip}/cgi-ws/{action}.cgi".format(**locals())
        logging.info("Rack.url(): " + url)
        return url

    def login(self, user, password):
        data = {"user": user, "pwd": password, "pagename": "login"}

        response = requests.post(self.url("login"), data=data, verify=False)

        expected_url = self.url("start_web")

        if response.url == self.url("login"):
            logging.info("Rack.login(): Login failed")
            return False

        if not response.url.startswith(expected_url):
            logging.info("Rack.login(): Login failed unexpectedly")
            return False

        logging.info("Rack.login(): Login successful")
        if not re.match(r"^" + expected_url + r"\?ccsession=[a-zA-Z0-9_]*$", response.url):
            logging.error(
                "Rack.login(): Cookie response does not match expected format")
            return False

        self.cookie = response.url.replace(expected_url + "?ccsession=", "")
        logging.info(self.cookie)

        return self.cookie != None
        # return [line for line in request]

    def logout(self):
        params = {"ccsession": self.cookie}
        return requests.get(self.url("login"), params=params, verify=False)

    def parse_values(self, valuestring):
        all_values = {}
        all_alarms = {}

        translated_values = {}

        for key, value in [pair.split('=') for pair in valuestring.split(';') if len(pair)]:
            if key.startswith("alarm"):
                all_alarms.update({str(key): str(value)})
            elif key.startswith("val"):
                all_values.update({str(key): str(value)})

            translate_value(translated_values, key, value)

        translated_values["raw"] = {"alarms": all_alarms, "values": all_values}
        return translated_values

    def get_constants(self):
        return {"name": self.name, "shortname": self.shortname}

    def get_values(self, include_raw=True):
        data = {"pagename": "ajax_read", "page": "status_c", "racknum": "0"}
        response = requests.post(
            self.url("ajax_request"), data=data, verify=False)

        data = self.get_constants()
        data.update(self.parse_values(response.text))
        if not include_raw:
            del data["raw"]
        return data


def rack_status_as_json(racknumber, user, password):
    rack = Rack(racknumber)
    if rack.login(user, password):
        values = rack.get_values()
        rack.logout()
    else:
        values = {"error": "login failed"}
    return values


if __name__ == "__main__":
    secrets_file = sys.argv[1]
    secrets = json.load(open(secrets_file))
    user = secrets['rack_user']
    DCL_PASS = secrets['rack_pass']
    racks = {
        "rack1-2": rack_status_as_json(1, user, DCL_PASS),
        "rack3-4": rack_status_as_json(1, user, DCL_PASS)
    }
    print json.dumps(racks, sort_keys=True)
