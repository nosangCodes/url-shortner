# URL Shortner

### Live URL
https://url-shortner-z044.onrender.com/

The URL Shortener API lets users turn long URLs into short ones with a custom alias. It tracks the number of clicks, unique visitors, and details like the user's operating system, device, and browser. It also records the location of users who access the short URL.

### Features implemented:
  - Generate short URLs for long URLs
  - Redirects users to original url
  - Tracks url analytics:
    - Total Clicks
    - Unique clicks(keeps record of ip address)
    - Clicks by date(provides array of objects for the past seven days and number of clicks)
    - Clicks by OS
    - Clicks by device
    - Fetch analytics for urls by topic
  - Caching data using redis for performance
  - Limit URL creation to 10 URLs per day for each user.


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
### 2. Shorten URL
- **Endpoint**: `POST /api/shorten`
- Headers:
  ```
    Authorization: Bearer YOUR_ACCESS_TOKEN
  ```
- Request body:
  ```json
    {
      "original_url": "https://nosang.in",
      "alias": "one",
      "topic": "portfolio"
    }
  ```
- Response:
  ```json
    {
      "user_id": "67a2f7cf2af79e2b78ce40b0",
      "original_url": "https://nosang.in",
      "alias": "lEYEeI1PoR",
      "topic": "",
      "_id": "67ab3dc5ad169a44a002728d",
      "createdAt": "2025-02-11T12:08:37.016Z",
      "updatedAt": "2025-02-11T12:08:37.016Z",
    }
  ```

### 3. Redirect to Original URL
- **Endpoint**: `GET /api/shorten/:alias`
- **Description**: Redirects the user to the original URL.

### 4. Get URL Analytics by alias:
- **Endpoint**: `GET /api/analytics/:alias`
- **Headers**:
  ```
    Authorization: Bearer YOUR_ACCESS_TOKEN
  ```
- Response:
  ```json
    {
      "totalClicks": 30,
      "uniqueClicks": 9,
      "clicksByDate": [
          {
              "clicks": 5,
              "date": "2025-02-06"
          },
          {
              "clicks": 21,
              "date": "2025-02-07"
          },
          {
              "clicks": 4,
              "date": "2025-02-11"
          }
      ],
      "osType": [
          {
              "totalClicks": 1,
              "os": "Tizen",
              "uniqueClicks": 1
          }
      ],
      "deviceType": [
          {
              "totalClicks": 1,
              "device": "mobile",
              "uniqueClicks": 1
          }
      ]
  }
  ```

### 5. Get Topic-Based Analytics API:
  - **Endpoint**: `GET /api/analytics/topic/:alias`
  - **Headers**:
      ```
      Authorization: Bearer YOUR_ACCESS_TOKEN
      ```
  - **Response**:
    ```json
      {
        "totalClicks": 29,
        "uniqueClicks": 6,
        "clicksByDate": [
          {
              "totalClicks": 5,
              "date": "2025-02-06"
          },
          {
              "totalClicks": 24,
              "date": "2025-02-07"
          }
          ],
          "urls": [
              {
                  "totalClicks": 26,
                  "shortUrl": "http://localhost:8000/api/shorten/ttU42wE7kd",
                  "uniqueClicks": 5
              },
              {
                  "totalClicks": 3,
                  "shortUrl": "http://localhost:8000/api/shorten/YpvLXMFEt6",
                  "uniqueClicks": 2
              }
          ]
      }
    ```
        
### 6. Get Overall Analytics API:
  - **Endpoint**: `GET api/analytics/overall`
  - **Headers**:
      ```
      Authorization: Bearer YOUR_ACCESS_TOKEN
      ```
  - **Response**:
    ```json
      {
        "totalClicks": 75,
        "uniqueUsers": 57,
        "totalUrls": 31,
        "clicksByDate": [
            {
                "totalClicks": 45,
                "date": "2025-02-07"
            },
            {
                "totalClicks": 3,
                "date": "2025-02-08"
            },
            {
                "totalClicks": 26,
                "date": "2025-02-06"
            }
        ],
        "osType": [
            {
                "os": "iOS",
                "uniqueClicks": 1
            },
            {
                "os": "WebOS",
                "uniqueClicks": 1
            }
        ],
        "deviceType": [
            {
                "deviceName": "console",
                "uniqueClicks": 8
            },
            {
                "deviceName": "",
                "uniqueClicks": 25
            },
            {
                "deviceName": "embedded",
                "uniqueClicks": 5
            },
        ]
    }
    ```
   

  
