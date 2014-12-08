#!/bin/bash -x
APPNAME=dictapp2
# cd .rhc_app
# rhc app create $APPNAME nodejs-0.10 mongodb-2.4 --from-code=https://github.com/openshift-quickstart/openshift-meteorjs-quickstart.git
# cd ../

git add . --all
git commit -a
git push origin

rm ./.demeteorized -rf

demeteorizer #-n 0.10.25 #-r 1.0.0

rm ./.rhc_app/$APPNAME/programs -rf
rm ./.rhc_app/$APPNAME/server -rf

mv ./.demeteorized/programs ./.rhc_app/$APPNAME/programs -f
mv ./.demeteorized/server ./.rhc_app/$APPNAME/server -f

# Copy
# if (!process.env.METEOR_SETTINGS){
#     process.env.METEOR_SETTINGS = '{	"public":{"ga":{"account":"UA-51899110-1"}}}';
# }
# to .rhc_app/[appname]/programs/server/boot.js
# echo "Copy Analytics code (view src of publi.sh) and Press enter to continue"
# read

cp -fv ./.rhc_app/boot.js ./.rhc_app/$APPNAME/programs/server/boot.js
cd ./.rhc_app/$APPNAME

git add . --all
git commit -am publishing
git push

# set env vars
rhc set-env METEOR_SETTINGS="{\"public\":{\"ga\":{\"id\":\"UA-51899110-1\"}}}"\
 DISABLE_WEBSOCKETS=1\
 -a $APPNAME
# for http
# process.env.DDP_DEFAULT_CONNECTION_URL = 'http://' + process.env.OPENSHIFT_APP_DNS + ':8000';
# for ssl
# process.env.DDP_DEFAULT_CONNECTION_URL = 'https://' + process.env.OPENSHIFT_APP_DNS + ':8443';

rhc app restart $APPNAME