#!/bin/bash

composer update
$(which apache2ctl) -DFOREGROUND