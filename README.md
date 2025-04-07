## SEVER

### BUILD AND RUN IN A DOCKER CONTAINER

```
docker build -t your-image-name .


# docker run --name my-container -p 4000:4000 -d your-image-name

```

### START A MULTI SERVICE

```
RUN `docker-compose up --build`

to stop all services
RUN `docker-compose down -v`

```

### VARIABLES

EMAIL_SECRET
EMAIL_USER
FRONTEND_URL

### RESOURCES

 - https://www.youtube.com/watch?v=nQdyiK7-VlQ //To host on ec2