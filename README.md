# 🛒 AiReal API

## 📖 Introduction

AiReal API provides endpoints to manage carts, place orders, and retrieve orders. The backend is built using Node.js and Express.js, deployed on Google App Engine, with Firestore for data storage and Google Cloud Storage for storing images.

## 🛠️ Getting Started

To run this project locally:

1. Clone the repository.
2. Run `npm install` to install dependencies.
3. Run `npm run dev` to start the backend services.

For environment variables, please contact the repository owner.

## 📚 Table of Contents

- [Introduction](#-introduction)
- [Getting Started](#-getting-started)
- [API Documentation](#-api-documentation)
  - [Authentication](#-authentication)
  - [Endpoints](#-endpoints)
    - [View Cart](#-view-cart)
    - [Place Order](#-place-order)
    - [Get All Orders](#-get-all-orders)
    - [Get All Orders By UserId](#-get-all-orders-by-userid)
- [Running the Project Locally](#-running-the-project-locally)

## 📝 API Documentation

### 🔐 Authentication

All endpoints require a Bearer Token for authentication. Include the token in the `Authorization` header:

```
Authorization: Bearer <token>
```

### 🔗 Endpoints

These are just some of them. If you want to see all the endpoints, please check our Postman documentation: [Postman Documentation](https://documenter.getpostman.com/view/26776811/2sA3QwapMh#intro)

#### 1. 🛒 View Cart

**GET /api/cart**

Retrieve the cart details for a specific user.

**Request**

- **URL**: `https://capstone-aireal.et.r.appspot.com/api/cart`
- **Params**:
  - `userId`: The user's ID

**Example Request**

```bash
curl --location "https://capstone-aireal.et.r.appspot.com/api/cart?userId=PXkcryhwCJSWINwo7Js9" \
--header "Authorization: Bearer <token>"
```

**Example Response**

```json
{
  "status": "success",
  "data": {
    "createdAt": {
      "_seconds": 1717590917,
      "_nanoseconds": 349000000
    },
    "userId": "PXkcryhwCJSWINwo7Js9",
    "updatedAt": {
      "_seconds": 1717590917,
      "_nanoseconds": 349000000
    },
    "items": [
      {
        "quantity": 5,
        "productId": "hN0xlisBzwoy7daRD06L"
      }
    ]
  }
}
```

#### 2. 🛍️ Place Order

**POST /api/order**

Place an order for a specific user.

**Request**

- **URL**: `https://capstone-aireal.et.r.appspot.com/api/order`
- **Body**:
  - `userId`: The user's ID

**Example Request**

```bash
curl --location "https://capstone-aireal.et.r.appspot.com/api/order" \
--header "Authorization: Bearer <token>" \
--header "Content-Type: application/json" \
--data "{
  \"userId\": \"PXkcryhwCJSWINwo7Js9\"
}"
```

**Example Response**

```json
{
  "status": "success",
  "message": "Order placed successfully"
}
```

#### 3. 📦 Get All Orders

**GET /api/order**

Retrieve all orders.

**Request**

- **URL**: `https://capstone-aireal.et.r.appspot.com/api/order`

**Example Request**

```bash
curl --location "https://capstone-aireal.et.r.appspot.com/api/order" \
--header "Authorization: Bearer <token>"
```

**Example Response**

```json
{
  "status": "success",
  "data": [
    {
      "id": "NuNRrLsVTsjtGZUUOrmy",
      "userId": "PXkcryhwCJSWINwo7Js9",
      "items": [
        {
          "quantity": 5,
          "productId": "hN0xlisBzwoy7daRD06L"
        }
      ],
      "createdAt": {
        "_seconds": 1717591144,
        "_nanoseconds": 774000000
      }
    }
  ]
}
```

#### 4. 📑 Get All Orders By UserId

**GET /api/orders/user/:userId**

Retrieve all orders for a specific user.

**Request**

- **URL**: `https://capstone-aireal.et.r.appspot.com/api/orders/user/:userId`
- **Path Variables**:
  - `userId`: The user's ID

**Example Request**

```bash
curl --location "https://capstone-aireal.et.r.appspot.com/api/orders/user/i9bIuFe9zIhsMynKedei" \
--header "Authorization: Bearer <token>"
```

**Example Response**

```json
{
  "status": "success",
  "data": [
    {
      "id": "CZF2Nmn0fsccJwEcxgoh",
      "userId": "i9bIuFe9zIhsMynKedei",
      "items": [
        {
          "quantity": 1,
          "productId": "UC0uhvkynSQFeIZH3NnO"
        }
      ],
      "createdAt": {
        "_seconds": 1717591144,
        "_nanoseconds": 774000000
      }
    }
  ]
}
```

## 💻 Running the Project Locally

1. **Clone the repository**:

```bash
git clone <repository_url>
cd <repository_directory>
```

2. **Install dependencies**:

```bash
npm install
```

3. **Run the development server**:

```bash
npm run dev
```

4. **Environment Variables**:

Contact the repository owner to get the required environment variables to run the project locally.
