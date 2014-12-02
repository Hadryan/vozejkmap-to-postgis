#!/bin/bash -
#title           :vozejkmap.sh
#description     :This script will download data from vozejkmap.cz and load it into given database.
#author          :zimmicz
#date            :20141202
#version         :0.1
#usage           :bash vozejkmap.sh
#bash_version    :4.3.11(1)-release
#==============================================================================

echo "Database username:"
read USER
echo "Database:"
read DB

if [ -f /tmp/locations.json ]
then
    if test `find "/tmp/locations.json" -mmin +1440`
    then
        wget http://www.vozejkmap.cz/opendata/locations.json -O /tmp/locations.json
        sed -i 's/\},{/\n},{/g' /tmp/locations.json
        echo -en "$(cat /tmp/locations.json)"
    fi
else
    wget http://www.vozejkmap.cz/opendata/locations.json -O /tmp/locations.json
    sed -i 's/\},{/\n},{/g' /tmp/locations.json
    echo -en "$(cat /tmp/locations.json)"

fi

psql -h localhost -U $USER -d $DB -f vozejkmap.sql