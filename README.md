# news-aggregator-zionet


# News Aggregator System

## Purpose of the System

The News Aggregator System is designed to provide users with personalized news content based on their preferences. The system allows users to register, set their news preferences, and receive curated news updates through various services integrated into a cohesive system. Users can receive timely updates and notifications via email, and the system pulls articles from different sources to provide comprehensive news coverage.

## System Diagram

System Diagram

1.The system consists of the following services:

2.User Service: Handles user registration, preference updates, and retrieving user information.

3.News Service: Fetches news articles based on user preferences from an external API.

4.Notification Service: Sends personalized news updates to users via email based on their preferences.

5.News Aggregator Backend: Orchestrates user and news data to serve various services.

6.News Aggregator Frontend: A web-based user interface where users can register, update preferences, and request news notifications.

7.Redis: Used for caching and enhancing data retrieval performance.

The services communicate internally using Docker networks and are containerized to ensure scalability and manageability.

A high-level view of the architecture:

```
User <--> User Service <--> News Aggregator Backend
                        ↳ News Service <--> External News API
                        ↳ Notification Service <--> Email Server
```

## Steps to Run the Application Locally

Follow these steps to set up the News Aggregator system locally using Docker Compose:

1. **Clone the Repository**:
   
   ```bash
   git clone https://github.com/your-username/news-aggregator.git
   cd news-aggregator
   ```

2. **Set Up Environment Variables**:
   - Ensure you have a `.env` file in the root directory. The `.env` file should contain configuration details such as MongoDB connection strings and email server credentials. Here is an example of required environment variables:
     
     ```
     MONGODB_URI=mongodb+srv://your-username:your-password@cluster.mongodb.net/newsAggregator
     EMAIL_USER=your-email@gmail.com
     EMAIL_PASS=your-email-password
     ```

3. **Install Docker and Docker Compose** (if not already installed):
   - Docker: [Docker Installation Guide](https://docs.docker.com/get-docker/)
   - Docker Compose: [Docker Compose Installation Guide](https://docs.docker.com/compose/install/)


4. **Run Docker Compose**:
   - Use Docker Compose to build and start the services:
   
   ```bash
   docker-compose up --build
   ```
   This command will build the images and start all the services: User Service, News Service, Notification Service, and News Aggregator Backend.

5. **Verify Running Services**:
   - Confirm that all services are running correctly by checking the Docker logs or accessing the endpoints:
     - User Service: [http://localhost:3000](http://localhost:3000)
     - News Service: [http://localhost:6001](http://localhost:6001)
     - Notification Service: [http://localhost:6002](http://localhost:6002)
     - News Aggregator Backend: [http://localhost:6003](http://localhost:6003)
     - News Aggregator Frontend  [http://localhost:3001](http://localhost:3001)

## Instructions for Testing the Application

1. **Testing User Registration**:
   - Open Postman and create a **POST** request to: [http://localhost:6003/users](http://localhost:6003/users)
   - Set the body to **JSON** format with the following fields:
     ```json
     {
       "name": "John Doe",
       "email": "john.doe@example.com",
       "age": 30,
       "preferences": ["technology", "sports"]
     }
     ```
   - Click **Send**. You should receive a success message confirming the user has been created.

2. **Testing User Preferences Update**:
   - Create a **PUT** request to update user preferences: [http://localhost:6003/users/email/{userEmail}/preferences](http://localhost:6003/users/email/{userEmail}/preferences)
   - Replace `{userEmail}` with the email of the user.
   - Set the body to **JSON** format:
     ```json
     {
       "preferences": ["business", "health"]
     }
     ```
   - Click **Send** to update the user preferences.

3. **Fetching News Based on User Preferences**:
   - Create a **POST** request to: [http://localhost:6001/users/fetch-news](http://localhost:6001/users/fetch-news)
   - Set the body to **JSON** format with the user's email:
     ```json
     {
       "email": "john.doe@example.com"
     }
     ```
   - Click **Send**. You should receive a list of news articles tailored to the user's preferences.

4. **Testing Email Notifications**:
   - Notifications are automatically scheduled via the Notification Service to be sent every 12 hours.
   - Alternatively, you can manually trigger a one-time notification by making a **POST** request to: [http://localhost:6002/notify](http://localhost:6002/notify)
   - Set the body to **JSON** format:
     ```json
     {
       "email": "john.doe@example.com",
       "message": "Here is your latest news update."
     }
     ```

     ** important : i have ran into some issues when trying to get users preferences from the db therefore this request is send with these parameters 

     {
  "email": "adamadlik9@gmail.com",
  "preferences": ["technology", "sports"]
}
initialy breaks the the original flow but still lets user manualy change his preferences



These steps will ensure that all components of the News Aggregator System are running correctly and that they can interact to provide users with a tailored news experience.

