# Mozilla Moderator

[![Code CI](https://github.com/mozilla/mozmoderator/actions/workflows/ci.yaml/badge.svg)](https://github.com/mozilla/mozmoderator/actions/workflows/ci.yaml)

Mozilla Moderator is a panel moderation webapp that enables users to view, vote and ask questions on different events.

Then panel moderators can export the questions and use them during panel discussions and Q&A.

## License

All mozmoderator source files are made available under the terms of the GNU Affero General Public License (AGPL).

## Development with Docker

After cloning this repo, you need to create an .env file. Make a copy of .env-dist named .env.

    cp .env-dist .env

Now docker compose from the root directory of the repo

    docker compose up

This brings up four services:

- `web` — Django dev server on `http://localhost:8000`
- `mysql` — MySQL 8 database
- `mailcatcher` — captures outgoing email at `http://localhost:1080`
- `node` — runs `vite build --watch` and rebuilds `moderator/moderate/static/dist/` whenever you edit anything under `frontend/src/`

Since this is Django, you will need to create a superuser for your dev work. Do this by attaching to the web container and running the command.

    docker compose exec web bash
    ./manage.py createsuperuser

You should now be able to login at /admin/

## Frontend assets

Frontend code lives in `frontend/src/` and is bundled by [Vite](https://vitejs.dev/). The `node` compose service watches the source tree and rebuilds automatically; you usually don't need to invoke npm directly.

To produce a one-shot production build, or to run the linters:

    docker compose run --rm node npm run build
    docker compose run --rm node npm run lint:js
    docker compose run --rm node npm run lint:css

## Tests

Run the Python test suite via pytest:

    docker compose run --rm web pytest -q

## CI & CD

CI runs via [GitHub Actions](https://github.com/mozilla/mozmoderator/actions/workflows/ci.yaml) on every PR and push: lint, pytest, and a Docker image build.

On push to `main` and on tags, `.github/workflows/build-and-push.yml` builds the Docker image and pushes it to [GCP Artifact Registry](https://cloud.google.com/artifact-registry) at `us-docker.pkg.dev/moz-fx-moderator-prod/moderator-prod/moderator`. A Kubernetes [Flux](https://fluxcd.io/) setup with [Helm Charts](https://github.com/mozilla-it/helm-charts/) picks up new images and rolls them out.

tl;dr: push commits to `main` for a stage deploy, cut a GitHub release tagged `v1.2.3` for a production deploy.
