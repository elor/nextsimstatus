#!/usr/bin/env python2
# -*- coding: utf-8 -*-

import sys
import json
import datetime
from time import sleep
from rackstatus import Rack, RACKS

from sendadminmail import sendMail

POLLING_INTERVAL = 20
ALLOWED_SUCCESSIVE_FAILURES = 5

SUPPLY_WATER_THRESHOLD_CELSIUS = 12
VALVE_THRESHOLD = 20

RECIPIENTS=[
    'main-simadmins@lists.tu-chemnitz.de',
    # 'michael.fischer@main.tu-chemnitz.de',
    # 'frank.weber@main.tu-chemnitz.de'
]

SENDER = 'erik.lorenz@zfm.tu-chemnitz.de'

def rack_supply_temperature(racknumber, user, password):
    rack = Rack(racknumber)
    if rack.login(user, password):
        values = rack.get_values()
        rack.logout()
        if values['valve_position'] > VALVE_THRESHOLD:
            return values['supply_water']
        else:
            return None
    log("Login failed")
    return None

def log(message):
    print "{}: {}".format(datetime.datetime.now().isoformat(), message)

if __name__ == "__main__":
    secrets_file = sys.argv[1]
    secrets = json.load(open(secrets_file))
    user = secrets['rack_user']
    password = secrets['rack_pass']

    successive_failures = 0
    while True:
        temperatures = [temperature for temperature in [rack_supply_temperature(rack_num, user, password) for rack_num in RACKS] if temperature]
        
        if len(temperatures):
            mean_temperature = sum(temperatures) / len(temperatures)
            log("Mean Temperature: {:.1f}".format(mean_temperature))
        
        if any([temperature > SUPPLY_WATER_THRESHOLD_CELSIUS for temperature in temperatures]):
            successive_failures += 1
            log("Failure No. {}".format(successive_failures))
            if successive_failures == ALLOWED_SUCCESSIVE_FAILURES:
                log("ERROR! MUST SEND MAIL!!!")

                subject=u'[C50.240]: Kühlwasserausfall: Zulauf bei {}°C'.format(mean_temperature)
                message=u'''
Der Kühlwasserzulauf der Serverschränke in Raum C50.240 hat soeben die Schwelltemperatur von {}°C überschritten.
Es ist aktuell {}°C heiß und erhitzt sich weiter.

------
Wenn du diese Nachricht zu oft erhältst oder künftig nicht mehr erhalten möchtest, wende dich bitte an
main-simadmin.lists.tu-chemnitz.de

Du kannst dich auch direkt an die Administratoren wenden:
Andreas Zienert (andreas.zienert@zfm.tu-chemnitz.de).
Erik Lorenz (erik.lorenz@zfm.tu-chemnitz.de)

Sag ihnen, sie sollen beim Mainsimstatus in 'failmail.py' die RECIPIENTS anpassen.
                '''.format(SUPPLY_WATER_THRESHOLD_CELSIUS, mean_temperature)

                for recipient in RECIPIENTS:
                    sendMail(sender=SENDER, recipient=recipient, subject=subject, message=message)
            elif successive_failures > ALLOWED_SUCCESSIVE_FAILURES:
                log("Still overheated")
        elif successive_failures:
            log("Resetting successive_failures")
            successive_failures = 0
    
        sleep(POLLING_INTERVAL)

log("Exiting infinite loop somehow...")
