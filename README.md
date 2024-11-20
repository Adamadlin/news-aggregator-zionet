# news-aggregator-zionet
a new aggregator project using micro services 

ensure Dapr is running and configured:
dapr run --app-id user-service --app-port 6000
dapr run --app-id news-service --app-port 6001
dapr run --app-id notification-service --app-port 6002

navigation to service: 
cd news-aggregator-zionet
cd news-aggregator
cd "service name" 



Start the User Service with Dapr: Open a terminal tab (or window) and run:
dapr run --app-id user-service --app-port 6000 -- npm start --prefix user-service


Start the News Service with Dapr: Open another terminal tab and run:
dapr run --app-id news-service --app-port 6001 -- npm start --prefix news-service


Start the Notification Service with Dapr: Open yet another terminal tab and run:
dapr run --app-id notification-service --app-port 6002 -- npm start --prefix notification-service







curl http://localhost:3000/user
curl http://localhost:6001/news
curl http://localhost:6002/notifications


run dapr dashboard
dapr dashboard -p 8080

dapr dashboard at :
http://localhost:8080/overview


kill proces: 
sof -i :6000
kill -9 "PID"



docker-compose up --build

runing docker without forcing it to build again 
docker-compose down
docker-compose up -d

runing docker wth rebuild 

docker-compose down
docker-compose build news-service
docker-compose up -d





// create a user 

curl -X POST http://localhost:3000/register \
     -H "Content-Type: application/json" \
     -d '{
           "name": "John Doe",
           "email": "john@example.com",
           "preferences": ["technology", "health", "science"]
         }'



start backend server 
node index.js


curl -X POST http://localhost:6001/news/fetch-by-user \
-H "Content-Type: application/json" \
-d '{"email": "lure.omatronfive@example.com"}'


curl -X POST http://localhost:6001/news/fetch-by-user \
-H "Content-Type: application/json" \
-d '{
    "email": "lure.omatronfive@example.com"
}'

