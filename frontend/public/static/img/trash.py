#!/usr/bin/env python
# -*- coding: utf-8 -*-

import requests
import re

channels = [{"deeplink": "NorthAmericana"}]

for channel in channels:
  deepLink = channel['deeplink']
  print(deepLink)
  url = f"http://player.siriusxm.com/rest/v2/experience/modules/get/deeplink?deepLinkId={deepLink}&deepLink-type=live"
  response = requests.get(url).json()
  images = response["ModuleListResponse"]["moduleList"]["modules"][0]["moduleResponse"]["moduleDetails"]["liveChannelResponse"]["liveChannelResponses"][0]["channel"]["images"]["images"]
  for image in images:
    if image['name'] == "color channel logo (on dark) ~ square":
      r = requests.get(image['url'], allow_redirects=True)
      open(f'{deepLink}-lg.png', 'wb').write(r.content)
      open(f'{deepLink}-sm.png', 'wb').write(r.content)
    # if image['name'] == "list view channel logo ~ square":
    #   r = requests.get(image['url'], allow_redirects=True)
    #   open(f'{deepLink}.png', 'wb').write(r.content)
    # if image['name'] == "white logo":
    #   r = requests.get(image['url'], allow_redirects=True)
    #   open(f'{deepLink}-white.png', 'wb').write(r.content)
