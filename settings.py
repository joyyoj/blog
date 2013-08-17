# -*- coding: utf-8 -*-

AUTHOR = 'xxxxxxxx xxxxxxxxxxxxx'
SITENAME = "xxxxxxxxxxxx"
SITEURL = 'http://xxxxxxxxxxxxxxxxx'
TIMEZONE = "Europe/Madrid"

GITHUB_URL = 'http://github.com/XXXXX'
DISQUS_SITENAME = "XXXXXXXXXX"
EMAIL = "XXXXXXXXXXXXXX@gmail.com"
PDF_GENERATOR = False
REVERSE_CATEGORY_ORDER = True
LOCALE = 'en_US'
DEFAULT_PAGINATION = 5

THEME = "iris"

FEED_RSS = 'feeds/all.rss.xml'
CATEGORY_FEED_RSS = 'feeds/%s.rss.xml'

LINKS = (('XXXXX XXXX', 'http://YYYYYYYYYYY.ZZZ'),)

SOCIAL = (('twitter', 'http://twitter.com/XXXXXX'),
          ('linkedin', 'http://www.linkedin.com/in/XXXXXXX'),
          ('github', GITHUB_URL),)

OUTPUT_PATH = 'output'
PATH = 'src'

ARTICLE_URL = "posts/{date:%Y}/{date:%m}/{slug}/"
ARTICLE_SAVE_AS = "posts/{date:%Y}/{date:%m}/{slug}/index.html"

GOSQUARED_SITENAME = "XXX-YYYYYY-X"

# global metadata to all the contents
#DEFAULT_METADATA = (('yeah', 'it is'),)

# static paths will be copied under the same name
STATIC_PATHS = ["images", ]

# A list of files to copy from the source to the destination
#FILES_TO_COPY = (('extra/robots.txt', 'robots.txt'),)
