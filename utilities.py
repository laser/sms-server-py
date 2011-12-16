import time

def dict_get(d, key, default=None):
    if d and d.has_key(key):
        return d[key]
    else:
        return default

def now_millis():
    return int(time.time() * 1000)