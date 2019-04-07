#!/bin/bash
for filename in ../png2/*.png; do
	convert -quality 98 $filename ./`basename $filename .png`.jpg
done
