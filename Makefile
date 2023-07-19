
build:
	yarn dist
	cd release && find . -not -name '.git' -delete && unzip ../builds/metamask-chrome-*.zip
