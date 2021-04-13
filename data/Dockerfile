# Use the specific MongoDB image for consistency
FROM mongo:4.4.3

# Set the default environment variables that will be read by Mongo when it initializes

# Set the root user and password
ENV MONGO_INITDB_ROOT_USERNAME sailor
ENV MONGO_INITDB_ROOT_PASSWORD 7.37knots

# Set the default database that will be used when Mongo intializes
ENV MONGO_INITDB_DATABASE admin

# Copy the mongo-init file that contains the scripts that we want to execute on initialization
# Mongo by default looks for scripts in docker-entrypoint-initdb.d when the container initializes
ADD mongo-init.js /docker-entrypoint-initdb.d/