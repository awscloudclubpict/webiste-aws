# API Documentation

Base URL: `https://webiste-aws.onrender.com/`

## Authentication Routes

### 1. Register Student
**Endpoint:** `POST /auth/register/student`

**Request Body:**
```json
{
  "fullName": "string (min 3 chars)",
  "email": "string (valid email)",
  "password": "string (min 6 chars)",
  "confirmPassword": "string (min 6 chars, must match password)",
  "mobileNumber": "string (min 10 chars)",
  "collegeName": "string (min 2 chars)",
  "branch": "string (min 2 chars)",
  "yearOfStudy": "number (integer, min 1)"
}
```

**Response (Success - 200):**
```json
{
  "user": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "mobileNumber": "1234567890",
    "collegeName": "ABC University",
    "branch": "Computer Science",
    "yearOfStudy": 3,
    "role": "student",
    "_id": "user_id_here"
  }
}
```

**Response (Error - 400/409):**
```json
{
  "error": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["fullName"],
      "message": "Required"
    }
  ]
}
```
or
```json
{
  "error": "User already exists"
}
```

### 2. Register Professional
**Endpoint:** `POST /auth/register/professional`

**Request Body:**
```json
{
  "fullName": "string (min 3 chars)",
  "email": "string (valid email)",
  "password": "string (min 6 chars)",
  "confirmPassword": "string (min 6 chars, must match password)",
  "mobileNumber": "string (min 10 chars)",
  "companyName": "string (min 2 chars)"
}
```

**Response (Success - 200):**
```json
{
  "user": {
    "fullName": "Jane Smith",
    "email": "jane@example.com",
    "mobileNumber": "1234567890",
    "companyName": "Tech Corp",
    "role": "professional",
    "_id": "user_id_here"
  }
}
```

**Response (Error - 400/409):**
```json
{
  "error": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["companyName"],
      "message": "Required"
    }
  ]
}
```
or
```json
{
  "error": "User already exists"
}
```

### 3. Register Admin
**Endpoint:** `POST /auth/register/admin`

**Request Body:**
```json
{
  "fullName": "string (min 3 chars)",
  "email": "string (valid email)",
  "password": "string (min 6 chars)",
  "mobileNumber": "string (min 10 chars)",
  "companyName": "string (min 2 chars)"
}
```

**Response (Success - 200):**
```json
{
  "user": {
    "fullName": "Admin User",
    "email": "admin@example.com",
    "mobileNumber": "1234567890",
    "companyName": "Admin Corp",
    "role": "admin",
    "_id": "user_id_here"
  }
}
```

**Response (Error - 400/409):**
```json
{
  "error": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["fullName"],
      "message": "Required"
    }
  ]
}
```
or
```json
{
  "error": "User already exists"
}
```

### 4. Login
**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "email": "string (valid email)",
  "password": "string (min 6 chars)"
}
```

**Response (Success - 200):**
```json
{
  "user": {
    "fullName": "John Doe",
    "email": "john@example.com",
    "mobileNumber": "1234567890",
    "collegeName": "ABC University",
    "branch": "Computer Science",
    "yearOfStudy": 3,
    "role": "student",
    "_id": "user_id_here"
  }
}
```

**Response (Error - 401):**
```json
{
  "error": "Invalid credentials"
}
```

### 5. Logout
**Endpoint:** `POST /auth/logout`

**Request Body:** None

**Response (Success - 200):**
```json
{
  "message": "Logged out"
}
```

## Event Routes

### 1. Create Event
**Endpoint:** `POST /events/create`

**Request Body:**
```json
{
  "event_id": "string (required)",
  "title": "string (required)",
  "description": "string (required)",
  "date": "string (ISO date format, required)",
  "time": "string (optional)",
  "venue": "string (required)",
  "mode": "Offline|Online|Hybrid (required)",
  "status": "Upcoming|Ongoing|Past (required)",
  "category": "string (required)",
  "registration_link": "string (URL, optional)",
  "banner_image_url": "string (URL, optional)"
}
```

**Response (Success - 201):**
```json
{
  "message": "Event created successfully",
  "event": {
    "event_id": "event_001",
    "title": "Tech Conference",
    "description": "A great event",
    "date": "2023-12-01T00:00:00.000Z",
    "time": "10:00 AM",
    "venue": "Auditorium",
    "mode": "Offline",
    "status": "Upcoming",
    "category": "Technology",
    "registration_link": "https://example.com/register",
    "banner_image_url": "https://s3.amazonaws.com/bucket/image.jpg",
    "createdBy": "admin",
    "_id": "event_id_here"
  }
}
```

**Response (Error - 400/409/500):**
```json
{
  "error": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["title"],
      "message": "Required"
    }
  ]
}
```
or
```json
{
  "error": "Event ID already exists"
}
```

### 2. Create Event with Image
**Endpoint:** `POST /events/create-with-image`

**Request Body (Form Data):**
- `banner_image_url`: File (image, max 5MB)
- Other fields as JSON string or form fields:
  - `event_id`: string (required)
  - `title`: string (required)
  - `description`: string (required)
  - `date`: string (ISO date, required)
  - `time`: string (optional)
  - `venue`: string (required)
  - `mode`: Offline|Online|Hybrid (required)
  - `status`: Upcoming|Ongoing|Past (required)
  - `category`: string (required)
  - `registration_link`: string (URL, optional)

**Response (Success - 201):**
```json
{
  "message": "Event created successfully with image",
  "event": {
    "event_id": "event_001",
    "title": "Tech Conference",
    "description": "A great event",
    "date": "2023-12-01T00:00:00.000Z",
    "time": "10:00 AM",
    "venue": "Auditorium",
    "mode": "Offline",
    "status": "Upcoming",
    "category": "Technology",
    "registration_link": "https://example.com/register",
    "banner_image_url": "https://s3.amazonaws.com/bucket/image.jpg",
    "createdBy": "admin",
    "_id": "event_id_here"
  }
}
```

**Response (Error - 400/409/500):**
```json
{
  "error": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["title"],
      "message": "Required"
    }
  ]
}
```
or
```json
{
  "error": "Event ID already exists"
}
```

### 3. Get All Events
**Endpoint:** `GET /events/`

**Request Parameters:** None

**Response (Success - 200):**
```json
{
  "events": [
    {
      "event_id": "event_001",
      "title": "Tech Conference",
      "description": "A great event",
      "date": "2023-12-01T00:00:00.000Z",
      "time": "10:00 AM",
      "venue": "Auditorium",
      "mode": "Offline",
      "status": "Upcoming",
      "category": "Technology",
      "registration_link": "https://example.com/register",
      "banner_image_url": "https://s3.amazonaws.com/bucket/image.jpg",
      "createdBy": "admin",
      "_id": "event_id_here"
    }
  ]
}
```

### 4. Get Events by Category
**Endpoint:** `GET /events/category/:type`

**Request Parameters:**
- `type`: string (path param, e.g., "webinar", "all")

**Response (Success - 200):**
```json
{
  "events": [
    {
      "event_id": "event_001",
      "title": "Tech Conference",
      "description": "A great event",
      "date": "2023-12-01T00:00:00.000Z",
      "time": "10:00 AM",
      "venue": "Auditorium",
      "mode": "Offline",
      "status": "Upcoming",
      "category": "Webinar",
      "registration_link": "https://example.com/register",
      "banner_image_url": "https://s3.amazonaws.com/bucket/image.jpg",
      "createdBy": "admin",
      "_id": "event_id_here"
    }
  ]
}
```

### 5. Update Event
**Endpoint:** `PUT /events/:event_id`

**Request Parameters:**
- `event_id`: string (path param)

**Request Body:**
```json
{
  "title": "string (optional)",
  "description": "string (optional)",
  "date": "string (ISO date, optional)",
  "time": "string (optional)",
  "venue": "string (optional)",
  "mode": "Offline|Online|Hybrid (optional)",
  "status": "Upcoming|Ongoing|Past (optional)",
  "category": "string (optional)",
  "registration_link": "string (URL, optional)",
  "banner_image_url": "string (URL, optional)"
}
```

**Response (Success - 200):**
```json
{
  "message": "Event updated successfully",
  "event": {
    "event_id": "event_001",
    "title": "Updated Title",
    "description": "Updated description",
    "date": "2023-12-01T00:00:00.000Z",
    "time": "10:00 AM",
    "venue": "Auditorium",
    "mode": "Offline",
    "status": "Upcoming",
    "category": "Technology",
    "registration_link": "https://example.com/register",
    "banner_image_url": "https://s3.amazonaws.com/bucket/image.jpg",
    "createdBy": "admin",
    "_id": "event_id_here"
  }
}
```

**Response (Error - 404):**
```json
{
  "error": "Event not found"
}
```

### 6. Update Event with Image
**Endpoint:** `PUT /events/:event_id/with-image`

**Request Parameters:**
- `event_id`: string (path param)

**Request Body (Form Data):**
- `banner_image_url`: File (image, max 5MB, optional)
- Other fields as JSON string or form fields (same as update event, all optional)

**Response (Success - 200):**
```json
{
  "message": "Event updated successfully with image",
  "event": {
    "event_id": "event_001",
    "title": "Updated Title",
    "description": "Updated description",
    "date": "2023-12-01T00:00:00.000Z",
    "time": "10:00 AM",
    "venue": "Auditorium",
    "mode": "Offline",
    "status": "Upcoming",
    "category": "Technology",
    "registration_link": "https://example.com/register",
    "banner_image_url": "https://s3.amazonaws.com/bucket/newimage.jpg",
    "createdBy": "admin",
    "_id": "event_id_here"
  }
}
```

### 7. Delete Event
**Endpoint:** `DELETE /events/:event_id`

**Request Parameters:**
- `event_id`: string (path param)

**Response (Success - 200):**
```json
{
  "message": "Event deleted successfully"
}
```

**Response (Error - 404):**
```json
{
  "error": "Event not found"
}
```

## Blog Routes

### 1. Create Blog
**Endpoint:** `POST /blogs/create`

**Request Body (Form Data):**
- `thumbnail_image_url`: File (image, max 5MB, optional)
- Other fields:
  - `title`: string (3-100 chars, required)
  - `author_name`: string (2-50 chars, required)
  - `short_description`: string (10-500 chars, optional)
  - `tags`: string (max 100 chars, optional)
  - `author_profile_url`: string (URL, optional)
  - `publish_date`: string (ISO date, optional)
  - `share_url`: string (URL, optional)

**Response (Success - 201):**
```json
{
  "message": "Blog created successfully",
  "blog": {
    "blog_id": "blog_001",
    "title": "Sample Blog",
    "author_name": "Author Name",
    "author_profile_url": "https://example.com/profile",
    "thumbnail_image_url": "https://s3.amazonaws.com/bucket/image.jpg",
    "short_description": "Short desc",
    "tags": "tech, aws",
    "publish_date": "2023-10-01T00:00:00.000Z",
    "share_url": "https://example.com/share",
    "_id": "blog_id_here"
  }
}
```

**Response (Error - 400/500):**
```json
{
  "error": "Validation failed",
  "details": [
    {
      "code": "too_small",
      "minimum": 3,
      "type": "string",
      "inclusive": true,
      "exact": false,
      "message": "Title must be at least 3 characters long",
      "path": ["title"]
    }
  ]
}
```

### 2. Get All Blogs
**Endpoint:** `GET /blogs/`

**Request Parameters:** None

**Response (Success - 200):**
```json
[
  {
    "blog_id": "blog_001",
    "title": "Sample Blog",
    "author_name": "Author Name",
    "author_profile_url": "https://example.com/profile",
    "thumbnail_image_url": "https://s3.amazonaws.com/bucket/image.jpg",
    "short_description": "Short desc",
    "tags": "tech, aws",
    "publish_date": "2023-10-01T00:00:00.000Z",
    "share_url": "https://example.com/share",
    "_id": "blog_id_here"
  }
]
```

### 3. Get Blog by ID
**Endpoint:** `GET /blogs/:id`

**Request Parameters:**
- `id`: string (blog_id, e.g., "blog_001")

**Response (Success - 200):**
```json
{
  "blog_id": "blog_001",
  "title": "Sample Blog",
  "author_name": "Author Name",
  "author_profile_url": "https://example.com/profile",
  "thumbnail_image_url": "https://s3.amazonaws.com/bucket/image.jpg",
  "short_description": "Short desc",
  "tags": "tech, aws",
  "publish_date": "2023-10-01T00:00:00.000Z",
  "share_url": "https://example.com/share",
  "_id": "blog_id_here"
}
```

**Response (Error - 404):**
```json
{
  "error": "Blog not found"
}
```

### 4. Get Blogs by Tag
**Endpoint:** `GET /blogs/tag/:tag`

**Request Parameters:**
- `tag`: string (path param)

**Response (Success - 200):**
```json
{
  "message": "Blogs with tag 'tech' fetched successfully",
  "count": 1,
  "blogs": [
    {
      "blog_id": "blog_001",
      "title": "Sample Blog",
      "author_name": "Author Name",
      "author_profile_url": "https://example.com/profile",
      "thumbnail_image_url": "https://s3.amazonaws.com/bucket/image.jpg",
      "short_description": "Short desc",
      "tags": "tech, aws",
      "publish_date": "2023-10-01T00:00:00.000Z",
      "share_url": "https://example.com/share",
      "_id": "blog_id_here"
    }
  ]
}
```

**Response (Error - 400/404):**
```json
{
  "error": "Tag parameter is required"
}
```
or
```json
{
  "error": "No blogs found with tag 'nonexistent'"
}
```

### 5. Delete Blog
**Endpoint:** `DELETE /blogs/:id`

**Request Parameters:**
- `id`: string (blog_id, e.g., "blog_001")

**Response (Success - 200):**
```json
{
  "message": "Blog deleted successfully",
  "deleted_blog": {
    "blog_id": "blog_001",
    "title": "Sample Blog",
    "author_name": "Author Name",
    "thumbnail_image_url": "https://s3.amazonaws.com/bucket/image.jpg"
  }
}
```

**Response (Error - 400/404):**
```json
{
  "error": "Invalid blog ID format"
}
```
or
```json
{
  "error": "Blog not found"
}
```

## Team Member Routes

### 1. Create Team Member
**Endpoint:** `POST /team-members/`

**Request Body:**
```json
{
  "name": "string (required)",
  "role": "string (required)",
  "team": "string (required)",
  "githubLink": "string (URL, optional)",
  "linkedinLink": "string (URL, optional)",
  "profileImage": "string (URL, optional)"
}
```

**Response (Success - 201):**
```json
{
  "message": "Team member created successfully",
  "teamMember": {
    "name": "John Doe",
    "role": "Developer",
    "team": "Web Dev",
    "githubLink": "https://github.com/johndoe",
    "linkedinLink": "https://linkedin.com/in/johndoe",
    "profileImage": "https://s3.amazonaws.com/bucket/image.jpg",
    "createdBy": "admin",
    "_id": "team_member_id_here"
  }
}
```

**Response (Error - 400):**
```json
{
  "error": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["name"],
      "message": "Required"
    }
  ]
}
```

### 2. Create Team Member with Image
**Endpoint:** `POST /team-members/create-with-image`

**Request Body (Form Data):**
- `profile_image`: File (image, max 5MB)
- Other fields:
  - `name`: string (required)
  - `role`: string (required)
  - `team`: string (required)
  - `githubLink`: string (URL, optional)
  - `linkedinLink`: string (URL, optional)

**Response (Success - 201):**
```json
{
  "message": "Team member created successfully with image",
  "teamMember": {
    "name": "John Doe",
    "role": "Developer",
    "team": "Web Dev",
    "githubLink": "https://github.com/johndoe",
    "linkedinLink": "https://linkedin.com/in/johndoe",
    "profileImage": "https://s3.amazonaws.com/bucket/image.jpg",
    "createdBy": "admin",
    "_id": "team_member_id_here"
  }
}
```

### 3. Get All Team Members
**Endpoint:** `GET /team-members/`

**Request Parameters:**
- `team`: string (query param, optional, e.g., "all", "Web Dev")

**Response (Success - 200):**
```json
{
  "teamMembers": [
    {
      "name": "John Doe",
      "role": "Developer",
      "team": "Web Dev",
      "githubLink": "https://github.com/johndoe",
      "linkedinLink": "https://linkedin.com/in/johndoe",
      "profileImage": "https://s3.amazonaws.com/bucket/image.jpg",
      "createdBy": "admin",
      "_id": "team_member_id_here"
    }
  ]
}
```

### 4. Get Core Team
**Endpoint:** `GET /team-members/core`

**Response (Success - 200):**
```json
{
  "teamMembers": [
    {
      "name": "John Doe",
      "role": "President",
      "team": "Core",
      "githubLink": "https://github.com/johndoe",
      "linkedinLink": "https://linkedin.com/in/johndoe",
      "profileImage": "https://s3.amazonaws.com/bucket/image.jpg",
      "createdBy": "admin",
      "_id": "team_member_id_here"
    }
  ]
}
```

### 5. Get Tech Team
**Endpoint:** `GET /team-members/tech-team`

**Response (Success - 200):**
```json
{
  "teamMembers": [
    {
      "name": "Jane Smith",
      "role": "Engineer",
      "team": "Tech Team",
      "githubLink": "https://github.com/janesmith",
      "linkedinLink": "https://linkedin.com/in/janesmith",
      "profileImage": "https://s3.amazonaws.com/bucket/image.jpg",
      "createdBy": "admin",
      "_id": "team_member_id_here"
    }
  ]
}
```

### 6. Get Web Dev Team
**Endpoint:** `GET /team-members/web-dev`

**Response (Success - 200):**
```json
{
  "teamMembers": [
    {
      "name": "Bob Johnson",
      "role": "Frontend Dev",
      "team": "Web Dev",
      "githubLink": "https://github.com/bobjohnson",
      "linkedinLink": "https://linkedin.com/in/bobjohnson",
      "profileImage": "https://s3.amazonaws.com/bucket/image.jpg",
      "createdBy": "admin",
      "_id": "team_member_id_here"
    }
  ]
}
```

### 7. Get Event Management Team
**Endpoint:** `GET /team-members/event-management`

**Response (Success - 200):**
```json
{
  "teamMembers": [
    {
      "name": "Alice Brown",
      "role": "Coordinator",
      "team": "Event Management",
      "githubLink": "https://github.com/alicebrown",
      "linkedinLink": "https://linkedin.com/in/alicebrown",
      "profileImage": "https://s3.amazonaws.com/bucket/image.jpg",
      "createdBy": "admin",
      "_id": "team_member_id_here"
    }
  ]
}
```

### 8. Get Design Team
**Endpoint:** `GET /team-members/design`

**Response (Success - 200):**
```json
{
  "teamMembers": [
    {
      "name": "Charlie Wilson",
      "role": "Designer",
      "team": "Design",
      "githubLink": "https://github.com/charliewilson",
      "linkedinLink": "https://linkedin.com/in/charliewilson",
      "profileImage": "https://s3.amazonaws.com/bucket/image.jpg",
      "createdBy": "admin",
      "_id": "team_member_id_here"
    }
  ]
}
```

### 9. Get Social Media Team
**Endpoint:** `GET /team-members/social-media`

**Response (Success - 200):**
```json
{
  "teamMembers": [
    {
      "name": "Diana Lee",
      "role": "Manager",
      "team": "Social Media",
      "githubLink": "https://github.com/dianalee",
      "linkedinLink": "https://linkedin.com/in/dianalee",
      "profileImage": "https://s3.amazonaws.com/bucket/image.jpg",
      "createdBy": "admin",
      "_id": "team_member_id_here"
    }
  ]
}
```

### 10. Get Documentation Team
**Endpoint:** `GET /team-members/documentation`

**Response (Success - 200):**
```json
{
  "teamMembers": [
    {
      "name": "Eve Garcia",
      "role": "Writer",
      "team": "Documentation",
      "githubLink": "https://github.com/evegarcia",
      "linkedinLink": "https://linkedin.com/in/evegarcia",
      "profileImage": "https://s3.amazonaws.com/bucket/image.jpg",
      "createdBy": "admin",
      "_id": "team_member_id_here"
    }
  ]
}
```

### 11. Get Tech Blog Team
**Endpoint:** `GET /team-members/tech-blog`

**Response (Success - 200):**
```json
{
  "teamMembers": [
    {
      "name": "Frank Miller",
      "role": "Blogger",
      "team": "Tech+Blog",
      "githubLink": "https://github.com/frankmiller",
      "linkedinLink": "https://linkedin.com/in/frankmiller",
      "profileImage": "https://s3.amazonaws.com/bucket/image.jpg",
      "createdBy": "admin",
      "_id": "team_member_id_here"
    }
  ]
}
```

### 12. Update Team Member
**Endpoint:** `PUT /team-members/:id`

**Request Parameters:**
- `id`: string (MongoDB ObjectId)

**Request Body:**
```json
{
  "name": "string (optional)",
  "role": "string (optional)",
  "team": "string (optional)",
  "githubLink": "string (URL, optional)",
  "linkedinLink": "string (URL, optional)",
  "profileImage": "string (URL, optional)"
}
```

**Response (Success - 200):**
```json
{
  "message": "Team member updated successfully",
  "teamMember": {
    "name": "Updated Name",
    "role": "Updated Role",
    "team": "Updated Team",
    "githubLink": "https://github.com/updated",
    "linkedinLink": "https://linkedin.com/in/updated",
    "profileImage": "https://s3.amazonaws.com/bucket/updated.jpg",
    "createdBy": "admin",
    "_id": "team_member_id_here"
  }
}
```

**Response (Error - 404):**
```json
{
  "error": "Team member not found"
}
```

### 13. Delete Team Member
**Endpoint:** `DELETE /team-members/:id`

**Request Parameters:**
- `id`: string (MongoDB ObjectId)

**Response (Success - 200):**
```json
{
  "message": "Team member deleted successfully"
}
```

**Response (Error - 404):**
```json
{
  "error": "Team member not found"
}
```

## Event Registration, Attendance and Certificate Routes

### 1. Event Registration
**Endpoint:** `POST /user-events/register`

**Request Body:**
```json
{
  "userId": "string (MongoDB ObjectId, required)",
  "eventId": "string (MongoDB ObjectId, required)"
}
```

**Response (Success - 201):**
```json
{
  "message": "User registered for event successfully",
  "registration": {
    "event": "69064b165422dd0447f34875",
    "attendanceMarked": false,
    "codeEntered": "",
    "certificateGenerated": false,
    "certificateUrl": "",
    "_id": "66f12abc98e4b200128ff45a"
  }
}

```

**Response (Error - 400/404/409/500):**
```json
{
  "error": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["userId"],
      "message": "Required"
    }
  ]
}

```
or
```json
{
  "error": "Event not found"
}
```

or
```json
{
  "error": "User not found"
}
```

or
```json
{
  "error": "User already registered for this event"
}

```

or
```json
{
  "error": "Internal server error"
}

```

### 2. Mark Attendance
**Endpoint:** `POST /user-events/attendance`

**Request Body:**
```json
{
  "userId": "string (MongoDB ObjectId, required)",
  "eventId": "string (MongoDB ObjectId, required)",
  "eventCode": "string (required, must match event's secret code)"
}

```

**Response (Success - 201):**
```json
{
  "message": "Attendance marked successfully",
  "data": {
    "userId": "69064c7616e1d11a4c59d027",
    "eventId": "69064b165422dd0447f34875",
    "attendanceMarked": true,
    "codeEntered": "aws_bootcamp_2025"
  }
}

```

**Response (Error - 400/404/409/500):**
```json
{
  "error": [
    {
      "code": "invalid_type",
      "expected": "string",
      "received": "undefined",
      "path": ["eventCode"],
      "message": "Required"
    }
  ]
}

```
or
```json
{
  "message": "You are not registered for this event"
}
```

or
```json
{
  "message": "Attendance already marked"
}
```

or
```json
{
  "message": "Invalid event code"
}
```

or
```json
{
  "message": "User not found"
}
```

or
```json
{
  "error": "Internal server error"
}
```

## Other Routes

### 1. Health Check
**Endpoint:** `GET /iamatharva`

**Response (Success - 200):**
```json
{
  "message": "API is running!",
  "status": "success"
}
```

### 2. Test Endpoint
**Endpoint:** `GET /test`

**Response (Success - 200):**
```json
{
  "message": "Test endpoint working!",
  "timestamp": "2023-10-01T12:00:00.000Z"
}
```

### 3. Profile Endpoint
**Endpoint:** `GET /profile`

**Response (Success - 200):**
```json
{
  "message": "Profile endpoint - auth middleware removed"
}
