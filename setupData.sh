#!/usr/bin/bash

# import the datasets

mongoimport --host 'db:27017'  -d test -c users --drop --jsonArray /home/users.json


echo 'DATA HAS BEEN IMPORTED INTO MONGODB... EXITING!';