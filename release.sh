#!/usr/bin/env sh

die() {
  echo >&2 "$@"
  exit 1
}

[ $# -eq 1 ] || die "1 argument required (version string)"
echo $1 | grep -E -q '^v[0-9]+\.[0-9]+\.[0-9]+$' || die "version string has to equal semver style"

[ -d release ] && rm -r release
mkdir -p release
cp -R build release
cp tidal.desktop release
cp deploy.sh release

tar cf - release | xz -qfe9F xz -T 4 > "tidal_desktop-$1.tar.xz"

