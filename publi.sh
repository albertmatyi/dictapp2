#!/bin/bash -x
APPNAME=dictapp2
cd .rhc_app
rhc app create $APPNAME nodejs-0.10 mongodb-2.4 --from-code=https://github.com/openshift-quickstart/openshift-meteorjs-quickstart.git
cd ../

git add . --all
git commit -a
git push origin master 

rm ./.demeteorized -R

demeteorizer -n 0.10.5 -r 0.6.5

rm ./.rhc_app/$APPNAME/programs -rf
rm ./.rhc_app/$APPNAME/server -rf

mv ./.demeteorized/programs ./.rhc_app/$APPNAME/programs -f
mv ./.demeteorized/server ./.rhc_app/$APPNAME/server -f

# Copy 
# if (!process.env.METEOR_SETTINGS){
#     process.env.METEOR_SETTINGS = '{"public":{"ga":{"account":"UA-51899110-1"}}} '; 
# }
# to .rhc_app/[appname]/programs/server/boot.js
# echo "Copy Analytics code (view src of publi.sh) and Press enter to continue"
read 

cd ./.rhc_app/$APPNAME

git add . --all
git commit -am publishing
git push
