install:
	bundle install

lint-ruby:
	bundle exec rubocop

lint-ruby-fix:
	bundle exec rubocop -a

lint-js:
	yarn lint

lint-js-fix:
	yarn lint --fix

lint:	lint-ruby lint-js

lint-fix: lint-ruby-fix lint-js-fix

test:
	rails test

generate-front-routes:
  rails js_routes:generate

compose-setup: compose-build compose-install

compose-build:
	docker-compose build

compose-install:
	docker-compose run --rm -u 1000:1000 web make install

compose-lint:
	docker-compose run --rm -u 1000:1000 web make lint

compose-lint-fix:
	docker-compose run --rm -u 1000:1000 web make lint-fix

compose-test:
	docker-compose run --rm -u 1000:1000 web make test

compose-shell:
	docker-compose run --rm -u 1000:1000 web /bin/bash

compose-run:
	docker-compose run --service-ports --rm -u 1000:1000 web

.PHONY: test
