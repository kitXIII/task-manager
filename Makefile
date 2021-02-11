install:
	bundle install

lint:
	bundle exec rubocop -a

test:
	rails test

compose-setup: compose-build compose-install

compose-build:
	docker-compose build

compose-install:
	docker-compose run --rm -u 1000:1000 web make install

compose-lint:
	docker-compose run --rm -u 1000:1000 web make lint

compose-test:
	docker-compose run --rm -u 1000:1000 web make test

compose-shell:
	docker-compose run --service-ports --rm -u 1000:1000 web /bin/bash

compose-run:
	docker-compose run --service-ports --rm -u 1000:1000 web

.PHONY: test