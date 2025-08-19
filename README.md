# Register-System: A JavaScript Authentication API

This API allows user registration, account activation via email, login, password reset requests, and password changes. It is built with Node.js, Express, and MongoDB.

The API uses JWT tokens to handle all registration, login, and email-based account activation/reset operations.

## 🚀 How to Run the Project

1. Clone the repository  
2. Rename `.env.dist` to `.env` and configure it with your environment variables  
3. Run `npm install`  
4. Run `npm start`

If you don’t have a *Gmail App Password*, you need to create one by visiting:

👉 https://myaccount.google.com/apppasswords

## 🧾 Endpoints

All API requests and responses use JSON format.

---

### ➕ POST `/register`

Creates a new user and sends an activation email.

**Request Body:**
```json
{
  "username": "brian",
  "email": "brian@example.com",
  "password": "123456"
}
```

**Responses:**
- `201`: Account created successfully.
- `400`: Email already registered.
- `500`: Failed to send activation email.

---

### ✅ GET `/activate?token=...`

Activates an account using the token sent to the user's email.

**Responses:**
- `200`: Account activated.
- `403`: Account already active.
- `404`: User not found.
- `400`: Invalid token.
- `500`: Token expired and failed to re-send activation email.

---

### 🔁 POST `/activation-request`

Re-sends the activation email if the user has not activated their account yet.

**Request Body:**
```json
{ "email": "brian@example.com" }
```

**Responses:**
- `200`: Activation email sent.
- `403`: Account already active.
- `404`: User not found.

---

### 🔐 POST `/login`

Authenticates a user and responds with a JWT token.

**Request Body:**
```json
{
  "email": "brian@example.com",
  "password": "123456"
}
```

**Responses:**
- `200`: Login successful. Token included.
- `400`: Account not active.
- `401`: Invalid credentials.
- `404`: User not found.

---

### 📧 POST `/reset-password-request`

Sends an email with a token to reset the password.

**Request Body:**
```json
{ "email": "brian@example.com" }
```

**Responses:**
- `200`: Password reset email sent.
- `403`: Account not active.
- `404`: User not found.

---

### 🔒 POST `/password-reset?token=...`

Allows the user to change the password using the token sent via email.

**Request Body:**
```json
{ "password": "newPassword123" }
```

**Responses:**
- `200`: Password changed successfully.
- `400`: Invalid token or same as the previous password.
- `403`: Account not active.
- `404`: User not found.
- `429`: You can only change your password once every 7 days.

---

### 🔐 GET `/verifyToken`

Returns the authenticated user information based on the provided token.

**Header:**
```
Authorization: Bearer <token>
```

**Responses:**
- `200`: Sucess true.
- `401`: Invalid or missing token.

---

## 📌 Notes

To customize the email text or styles, edit the files located in:  
`/root/services/mails/`
