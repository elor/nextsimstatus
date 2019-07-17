#!/usr/bin/env python2

import smtplib
from email.mime.text import MIMEText

HOST = 'localhost'

def sendMail(sender, recipient, subject, message):
  msg = MIMEText(message, 'plain', 'utf-8')
  msg['Subject'] = subject
  msg['From'] = sender
  msg['To'] = recipient

  mail = smtplib.SMTP(HOST)
  mail.sendmail(sender, [recipient], msg.as_string())
  mail.quit()
