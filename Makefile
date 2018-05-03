.PHONY: start-dev

start-dev:
	agreed-server --path ./doc/agreed/agreed.js --port 3030 & \
	agreed-ui --path ./doc/agreed/agreed.js --port 3040 & \
	cd src && npm start

shutdown:
	pgrep node | xargs kill -9
