#!/usr/bin/env sh

current_user=`whoami`
home_dir=`cat /etc/passwd | grep -w $current_user`

## get the second to last element which is separated by ':' by
## first removing everything from passwd data after the last ':'
home_dir=${home_dir%:*}
## and then removing everything from passwd data before the new last ':'
home_dir=${home_dir##*:}

sudo rm -rf "$home_dir/.local/share/TIDAL-linux-x64"
mkdir -p "$home_dir/.local/share"
cp -R build/TIDAL-linux-x64 "$home_dir/.local/share"
sudo chown root:root "$home_dir/.local/share/TIDAL-linux-x64/chrome-sandbox"
sudo chmod 4755 "$home_dir/.local/share/TIDAL-linux-x64/chrome-sandbox"
mkdir -p "$home_dir/.local/share/applications"
sed -i "s:<HOME>:$home_dir:g" tidal.desktop
cp tidal.desktop "$home_dir/.local/share/applications"

