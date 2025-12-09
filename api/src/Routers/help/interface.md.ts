const md = `
# Coffli API Documentation.

## Introduction

This is the API documentation for the Coffli project.

## Response Format

All interfaces return a unified JSON response format:

\`\`\`json
{
    "code": 200,
    "message": "Operation successful",
    "data": {} // Optional, specific data
}
\`\`\`

### HTTP Status Codes

| Code | Description |
|------|-------------|
| 200  | Operation successful |
| 201  | Created successfully |
| 400  | Bad request parameters |
| 401  | Unauthorized access |
| 403  | Forbidden |
| 404  | Resource not found |
| 409  | Resource conflict (e.g., user already exists) |
| 500  | Internal server error |

---

## User Management Interface

### 1. User Registration

- **Method**: POST
- **Path**: \`/user/register\`
- **Description**: Register New User
- **Headers**: None
- **Body**:
  \`\`\`json
  {
      "user_id": "string (Required)",
      "password": "string (Required)", 
      "nickname": "string (Optional, default is user_id)"
  }
  \`\`\`
- **Response**:
  - 200: Registration Successful
  - 400: Missing required fields
  - 409: User ID already exists
  - 500: Registration failed

**Example Request**:
\`\`\`bash
curl -X POST %BASEURL%/user/register \\
  -H "Content-Type: application/json" \\
  -d '{
    "user_id": "roy-jin",
    "password": "password123",
    "nickname": "Roy Jin"
  }'
\`\`\`

**Example response**:
\`\`\`json
{
    "code": 200,
    "message": "Registration successful"
}
\`\`\`

### 2. User Login

- **Method**: POST
- **Path**: \`/user/login\`
- **Description**: User login, obtain access token
- **Headers**: None
- **Body**:
  \`\`\`json
  {
      "id": "string (Required)",
      "password": "string (Required)"
  }
  \`\`\`
- **Response**:
  - 200: Login successful, returns user information and token
  - 400: Missing required fields
  - 401: Incorrect password
  - 404: User not found
  - 500: Login failed

**Example Request**:
\`\`\`bash
curl -X POST %BASEURL%/user/login \\
  -H "Content-Type: application/json" \\
  -d '{
    "id": "roy-jin",
    "password": "password123"
  }'
\`\`\`

**Example response**:
\`\`\`json
{
    "code": 200,
    "message": "Login successful",
    "data": {
        "user": {
            "user_id": "roy-jin",
            "nickname": "Roy Jin",
            "last_login": 1767225600000,
            "role": "USER",
            "gender": 3,
            "reg_time": 1767225600000,
            "active": true,
            "avatar": "",
            "info": "{\\"ip\\": \\"\\", \\"email\\": \\"\\", \\"phone\\": \\"\\", \\"birthday\\": \\"\\", \\"bio\\": \\"\\"}"
        },
        "token": "am9obl9kb2UtMTcwMTYwMDAwMDAwMA=="
    }
}
\`\`\`

### 3. User Logout

- **Method**: POST
- **Path**: \`/user/logout\`
- **Description**: User logout, delete access token
- **Headers**:
  - \`X-User-Id\`: User ID
  - \`Authorization\`: Access Token
- **Body**: None
- **Response**:
  - 200: Logout successful
  - 401: Unauthorized
  - 500: Logout failed

**Example Request**:
\`\`\`bash
curl -X POST %BASEURL%/user/logout \\
  -H "X-User-Id: roy-jin" \\
  -H "Authorization: am9obl9kb2UtMTcwMTYwMDAwMDAwMA=="
\`\`\`

### 4. Get User Information

- **Method**: GET
- **Path**: \`/user/get\`
- **Description**: Get information of the specified user
- **Query parameters**:
  - \`id\`: User ID (Required)
- **Response**:
  - 200: Retrieval successful
  - 404: User not found
  - 500: Retrieval failed

**Example Request**:
\`\`\`bash
curl "%BASEURL%/user/get?id=roy-jin"
\`\`\`

**Example response**:
\`\`\`json
{
    "code": 200,
    "message": "User fetched successfully",
    "data": {
        "user_id": "roy-jin",
        "nickname": "Roy Jin",
        "last_login": 1767225600000,
        "role": "USER",
        "gender": 3,
        "reg_time": 1767225600000,
        "active": true,
        "avatar": "",
        "info": "{\\"ip\\": \\"\\", \\"email\\": \\"\\", \\"phone\\": \\"\\", \\"birthday\\": \\"\\", \\"bio\\": \\"\\"}"
    }
}
\`\`\`

### 5. Check User Authentication
- **Method**: GET
- **Path**: \`/user/auth\`
- **Description**: Check if the user is authenticated
- **Headers**:
  - \`X-User-Id\`: User ID
  - \`Authorization\`: Access Token
- **Body**: None
- **Response**:
  - 200: Authentication successful
  - 400: Missing required fields
  - 401: Unauthorized
  - 500: Authentication failed

**Example Request**:
\`\`\`bash
curl -X GET %BASEURL%/user/auth \\
  -H "X-User-Id: roy-jin" \\
  -H "Authorization: am9obl9kb2UtMTcwMTYwMDAwMDAwMA=="
\`\`\`

**Example response**:
\`\`\`json
{
    "code": 200,
    "message": "Authentication"
}

### 6. Update User Information

- **Method**: POST
- **Path**: \`/user/update\`
- **Description**: Update user information (nickname, gender, additional information)
- **Headers**:
  - \`X-User-Id\`: User ID
  - \`Authorization\`: Access Token
- **Body**:
  \`\`\`json
  {
      "nickname": "string (Optional)",
      "gender": "number (Optional, 1: Male, 2: Female, 3: Unknown)",
      "avatar": "string (Optional, Base64 encoded string of user avatar)",
      "info": {
          "email": "string (Optional)",
          "phone": "string (Optional)",
          "birthday": "string (Optional, format: YYYY-MM-DD)",
          "bio": "string (Optional)"
      }
  }
  \`\`\`
- **Response**:
  - 200: Update successful
  - 400: Missing valid fields or invalid parameter format
  - 401: Unauthorized
  - 500: Update failed

**Example Request**:
\`\`\`bash
curl -X POST %BASEURL%/user/update \\
  -H "X-User-Id: roy-jin" \\
  -H "Authorization: am9obl9kb2UtMTcwMTYwMDAwMDAwMA==" \\
  -H "Content-Type: application/json" \\
  -d '{
    "nickname": "New Nickname",
    "gender": 1,
    "info": {
        "email": "new.email@example.com",
        "phone": "1234567890",
        "birthday": "1990-01-01",
        "bio": "This is my new bio."
    }
  }'
\`\`\`

**Example response**:
\`\`\`json
{
    "code": 200,
    "message": "User information updated successfully"
}
\`\`\`

---

## Blog Management Interface

### 7. Get Blog Posts

- **Method**: GET
- **Path**: \`/blog/get\`
- **Description**: Get a specific blog post
- **Query parameters**:
  - \`id\`: Blog ID (Required)
- **Response**:
  - 200: Retrieval successful
  - 400: Blog ID missing
  - 500: Retrieval failed

**Example Request**:
\`\`\`bash
curl "%BASEURL%/blog/get?id=123"
\`\`\`

**Example response**:
\`\`\`json
{
    "code": 200,
    "message": "Blog retrieved successfully",
    "data": {
        "id": 123,
        "user_id": "roy-jin",
        "title": "My First Blog Post",
        "content": "This is blog content...",
        "created_at": 1767225600000
    }
}
\`\`\`

### 8. Create a Blog Post

- **Method**: POST
- **Path**: \`/blog/create\`
- **Description**: Create a new blog post
- **Headers**:
  - \`X-User-Id\`: User ID
  - \`Authorization\`: Access Token
- **Body**:
  \`\`\`json
  {
      "title": "string (Required)",
      "content": "string (Required)"
  }
  \`\`\`
- **Response**:
  - 200: Created successfully
  - 401: Unauthorized
  - 500: Creation failed

**Example Request**:
\`\`\`bash
curl -X POST %BASEURL%/blog/create \\
  -H "X-User-Id: roy-jin" \\
  -H "Authorization: am9obl9kb2UtMTcwMTYwMDAwMDAwMA==" \\
  -H "Content-Type: application/json" \\
  -d '{
    "title": "My First Blog Post",
    "content": "This is blog content..."
  }'
\`\`\`

**Example response**:
\`\`\`json
{
    "code": 200,
    "message": "Blog created successfully"
}
\`\`\`

### 9. Delete Blog Post

- **Method**: POST
- **Path**: \`/blog/delete\`
- **Description**: Delete the specified blog post
- **Headers**:
  - \`X-User-Id\`: User ID
  - \`Authorization\`: Access Token
- **Body**:
  \`\`\`json
  {
      "blog_id": "string (Required)"
  }
  \`\`\`
- **Response**:
  - 200: Deletion successful
  - 401: Unauthorized
  - 404: Blog not found
  - 500: Deletion failed

**Example Request**:
\`\`\`bash
curl -X POST %BASEURL%/blog/delete \\
  -H "X-User-Id: roy-jin" \\
  -H "Authorization: am9obl9kb2UtMTcwMTYwMDAwMDAwMA==" \\
  -H "Content-Type: application/json" \\
  -d '{
    "blog_id": "123"
  }'
\`\`\`

**Example response**:
\`\`\`json
{
    "code": 200,
    "message": "The blog has been successfully deleted"
}
\`\`\`

---

## System Management Interface

### 10. Database Initialization

- **Method**: GET
- **Path**: \`/init\`
- **Description**: Initialize database table structure
- **Headers**:
  - \`X-Debug-Token\`: Debug Token
- **Query parameters**:
  - \`force\`: boolean (Optional, force reinitialization)
- **Response**:
  - 200: Initialization successful
  - 401: Unauthorized
  - 500: Initialization failed

**Example Request**:
\`\`\`bash
curl "%BASEURL%/init?force=true" \\
  -H "X-Debug-Token: your_debug_token"
\`\`\`

**Example response**:
\`\`\`json
{
    "code": 200,
    "message": "The forced initialization of the database is successful"
}
\`\`\`

### 11. SQL Execution

- **Method**: GET, POST
- **Path**: \`/sql\`
- **Description**: Execute SQL query (for debugging purposes only)
- **Headers**:
  - \`X-Debug-Token\`: Debug Token
- **Query parameters**:
  - \`sql\`: SQL Sentence
- **Body**:
  \`\`\`json
  {
      "sql": "string (Required)",
      "params": "array (Optional, array of parameters)"
  }
  \`\`\`
- **Response**:
  - 200: Execution successful
  - 401: Unauthorized
  - 500: Execution failed

**Example Request**:
\`\`\`bash
# GET METHOD
curl "%BASEURL%/sql?sql=SELECT%20*%20FROM%20USERS" \\
  -H "X-Debug-Token: your_debug_token"

# POST METHOD
curl -X POST %BASEURL%/sql \\
  -H "X-Debug-Token: your_debug_token" \\
  -H "Content-Type: application/json" \\
  -d '{
    "sql": "SELECT * FROM USERS WHERE user_id = ?",
    "params": ["roy-jin"]
  }'
\`\`\`

**Example response**:
\`\`\`json
{
    "code": 200,
    "message": "Success",
    "results": [
        {
            "user_id": "roy-jin",
            "nickname": "Roy Jin",
            "last_login": 1767225600000,
            "role": "USER",
            "gender": 3,
            "reg_time": 1767225600000,
            "active": true,
            "avatar": "",
            "info": "{\\"ip\\": \\"\\", \\"email\\": \\"\\", \\"phone\\": \\"\\", \\"birthday\\": \\"\\", \\"bio\\": \\"\\"}"
        }
    ]
}
\`\`\`

### 12. API Documentation

- **Method**: GET
- **Path**: \`/help\`
- **Description**: Get the API documentation (HTML format)
- **Response**: Return a formatted HTML document

**Example Request**:
\`\`\`bash
curl "%BASEURL%/help"
\`\`\`

### 13. Root Path

- **Method**: GET
- **Path**: \`/\`
- **Description**: Server Health Check
- **Response**: Returns a simple message "Hello, Coffli!"

**Example Request**:
\`\`\`bash
curl "%BASEURL%/"
\`\`\`

---

## Precautions

1. **Authentication Mechanism**: Interfaces that require authentication must provide valid \`X-User-Id\` and \`Authorization\` headers.
2. **Debug Interfaces**: The \`/init\` and \`/sql\` interfaces require a valid debug token.
3. **Data Format**: All requests and responses use JSON format.
4. **Error Handling**: All errors will return a unified error format.

For detailed sql table structure, please refer to the implementation of the \`/init\` interface (Only for debugging purposes).
`;

export default md;