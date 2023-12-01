###########
# BUILDER - new python image with name 'builder' #
###########

FROM python:3.9 as builder
# Disable .pyc files creation, we need to run image once
ENV PYTHONDONTWRITEBYTECODE=1
# Dont save to buffer, print logs immideately
ENV PYTHONUNBUFFERED=1
# Wolder we work with in builder
WORKDIR /usr/src/app

# install psycopg2 dependencies
RUN apt-get update || apt-get install gcc vim libpq-dev python3-dev musl-dev -y whatever

COPY ./requirements.txt .
RUN pip install --upgrade pip
RUN pip install -r requirements.txt

#########
# FINAL #
#########

FROM python:3.8

RUN apt-get update || apt-get install nmap vim libpq -y
RUN apt install -y netcat-traditional

RUN mkdir -p /home/p2puser/dev.p2ptradehelper.ru
RUN adduser --system --group p2puser

ENV HOME=/home/p2puser/dev.p2ptradehelper.ru
ENV APP_HOME=/home/p2puser/dev.p2ptradehelper.ru/p2phelper
RUN mkdir $APP_HOME
RUN mkdir $APP_HOME/static
RUN mkdir $APP_HOME/media
WORKDIR $APP_HOME

COPY --from=builder /usr/src/app/requirements.txt .
RUN pip install -r requirements.txt

COPY ./entrypoint.sh .
RUN sed -i 's/\r$//g'  $APP_HOME/entrypoint.sh
RUN chmod +x $APP_HOME/entrypoint.sh

COPY . $APP_HOME
RUN chown -R p2puser:p2puser $APP_HOME

USER p2puser

# run entrypoint.sh
ENTRYPOINT ["/home/p2puser/dev.p2ptradehelper.ru/p2phelper/entrypoint.sh"]
