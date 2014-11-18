#!/bin/bash
cd lib/less
for file in *.less ; do mv "$file" "${file/.less/}.lessimport" ; done
sed -i "s/\@{fa-css-prefix}/fa/g" *.lessimport

