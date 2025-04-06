## SEVER

### BUILD AND RUN IN A DOCKER CONTAINER

```
docker build -t your-image-name .


# docker run --name my-container -p 4000:4000 -d your-image-name

```

### START A PG CONTAINER

```
# docker run --name pg-database -e POSTGRES_USER=postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=sellit -p 5432:5432 -d postgres:13

```


### RESOURCES

 - https://www.youtube.com/watch?v=nQdyiK7-VlQ //To host on ec2