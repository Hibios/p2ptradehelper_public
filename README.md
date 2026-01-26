A tool for P2P arbitrage - all possible trading pairs across Binance, Huobi, Bybit, OKX exchanges, as well as Bestchange.

This branch allows for instant deployment of a production-like environment, though primarily intended for testing. Deploying the production version in this way is only being considered due to database-related considerations.

To use this repository, you need a server with Docker and Docker Compose installed, and a domain name linked to it.

If you need to use this template for another project, it is sufficient to change the domain name and remove any unnecessary services from the docker-compose file.

Tech stack used: Python + Django + REST API + Redis + Celery + React + Bootstrap + Docker Compose + PostgreSQL + GitHub Actions

Deployment steps:

Clone the repository onto the server with the domain linked to it.

Initialize an additional git repository inside the main one:
``` diff
git submodule init
```

Populate the submodule repository:
``` diff
git submodule update
```

Run:
``` diff
sudo ./init-letsencrypt.sh
```

To deploy the website:
``` diff
docker-compose -f docker-compose.yml up -d --build
```

To stop the website and clear all data, including the database:
``` diff
docker-compose down -v
```
