#!/bin/bash

composer update
/usr/sbin/apache2ctl -DFOREGROUND
