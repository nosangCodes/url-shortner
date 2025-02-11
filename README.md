# URL Shortner

The URL Shortener API lets users turn long URLs into short ones with a custom alias. It tracks the number of clicks, unique visitors, and details like the user's operating system, device, and browser. It also records the location of users who access the short URL.

## Instructions to run the project.

### Prerequisites

Ensure you have the following installed:
  - Node.js (v22+ recommended)
  - MongoDB (local or cloud instance)
  - Redis (local or cloud instance)

### Steps
- Clone the repository:
   ```sh
   git clone https://github.com/nosangCodes/url-shortner.git
   ```
   
- Navigate to project directory
  ```sh
  cd ./url-shortner
  ```
- Install dependencies
  ```sh
  npm install
  ```
- Create a `.env` file for configuration:
  
  ```env
    PORT = 8000

    GOOGLE_CLIENT_ID = ""
    GOOGLE_CLIENT_SECRET = ""

    DB_URL="Mongo db url"

    JWT_ACCESS_SECRET=""
    JWT_REFRESH_SECRET=""
    
    SERVER_URL="http://localhost:8000"

    # if local instance
    REDIS_HOST=localhost 
    REDIS_PORT=6379
  ```
- Start redis server
  ```sh
    redis-server  
  ```
- Start development server
  ```sh
    npm run dev
  ```


  ## API endpoints

  ### 1. Sign in with Google
  - **Endpoint**: `GET /api/auth/google`
  - Response:
    ```json
      {
        "accessToken": "",
        "refreshToken": "",
        "message": "",
      }
    ```

  ### 2. Redirect to Original URL
  - **Endpoint**: `GET /api/shorten/:alias`
  - **Description**: Redirects the user to the original URL.



  
