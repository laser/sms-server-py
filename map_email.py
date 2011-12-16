#!/usr/bin/python

from smtplib import SMTP
from email.MIMEText import MIMEText
from email.Header import Header
from email.Utils import parseaddr, formataddr
from utilities import dict_get
import os

smtp_user = dict_get(os.environ, 'ENEE_SMTP_USER')
smtp_password = dict_get(os.environ, 'ENEE_SMTP_PASSWORD')
smtp_server = dict_get(os.environ, 'ENEE_SMTP_SERVER')
smtp_port = dict_get(os.environ, 'ENEE_SMTP_PORT')

def mail(to, cc, bcc, subject, text):
    """Send an email.

    All arguments should be Unicode strings (plain ASCII works as well).

    Only the real name part of sender and recipient addresses may contain
    non-ASCII characters.

    The charset of the email will be the first one out of US-ASCII, ISO-8859-1
    and UTF-8 that can represent all the characters occurring in the email.
    """

    # Header class is smart enough to try US-ASCII, then the charset we
    # provide, then fall back to UTF-8.
    header_charset = 'ISO-8859-1'

    # We must choose the body charset manually
    for body_charset in 'US-ASCII', 'ISO-8859-1', 'UTF-8':
        try:
            text.encode(body_charset)
        except UnicodeError:
            pass
        else:
            break

    # Make sure email addresses do not contain non-ASCII characters
    sender_addr = gmail_user.encode('ascii')
    toaddrs = [to] + cc + bcc

    # Create the message ('plain' stands for Content-Type: text/plain)
    msg = MIMEText(text.encode(body_charset), 'plain', body_charset)
    msg['From'] = sender_addr
    msg['To'] = to
    msg['Subject'] = Header(unicode(subject), header_charset)

    smtp = SMTP(smtp_server, smtp_port)
    smtp.ehlo()
    smtp.starttls()
    smtp.ehlo()
    smtp.login(smtp_user, smtp_password)
    smtp.sendmail(gmail_user, toaddrs, msg.as_string())
    smtp.close()