#!/bin/bash

LC_ALL="en_US.UTF-8";
LANG="en_US.UTF-8";
LANGUAGE="en_US:en";

#-------------------#
#----- Helpers -----#
#-------------------#

usage() {
    echo "$0 [COMMAND] [ARGUMENTS]"
    echo "  Commands:"
    echo "  - up: rebuild and start all containers"
    echo "  - down: stop all containers"
    echo "  - configure: configure application"
    echo "  - recreate: recreate docker containers for env refresh"
    echo "  - db-rebuild: rebuild database"
}

fn_exists() {
    type $1 2>/dev/null | grep -q 'is a function'
}

COMMAND="$1"
shift
ARGUMENTS="${@}"

#--------------------#
#----- Commands -----#
#--------------------#

up() {
    docker-compose up -d --build --remove-orphans;
}

down() {
    docker-compose down;
}

recreate() {
    docker-compose up -d --force-recreate;
}

db-rebuild() {
    ENV=${1:-prod}
    NODE_ENV=${ENV} ./node_modules/.bin/sequelize db:drop;
    NODE_ENV=${ENV} ./node_modules/.bin/sequelize db:create;
    NODE_ENV=${ENV} ./node_modules/.bin/sequelize db:migrate;
    NODE_ENV=${ENV} ./node_modules/.bin/sequelize db:seed:all;
}

configure() {
    if [ ! -f config/config.json ]; then
        cp config/config.json.dist config/config.json;
    fi;
}

#---------------------#
#----- Execution -----#
#---------------------#

fn_exists $COMMAND
if [ $? -eq 0 ]; then
    $COMMAND "$ARGUMENTS"
else
    usage
fi
