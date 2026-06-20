# 🌿 Virtual Herbal Garden

A full-stack web application for exploring, learning about, and purchasing AYUSH herbal products. The platform covers traditional Indian medicine systems — **Ayurveda**, **Siddha**, **Unani**, **Homeopathy**, and **Yoga** — with a modern e-commerce experience.

---

## 📋 Table of Contents

- [Features](#-features)
- [Tech Stack](#-tech-stack)
- [Project Structure](#-project-structure)
- [Getting Started](#-getting-started)
- [Environment Variables](#-environment-variables)
- [API Endpoints](#-api-endpoints)
- [Pages Overview](#-pages-overview)
- [Database Models](#-database-models)
- [Contributing](#-contributing)
- [License](#-license)

---

## ✨ Features

- 🌱 **Herbal Product Catalog** — Browse products by AYUSH medicine systems
- 🔍 **Search & Filter** — Find herbs by name, category, or tag
- 🛒 **Shopping Cart** — Add, update, and remove items from the cart
- 📦 **Order Management** — Place and track orders
- 👤 **User Authentication** — JWT-based register/login with protected routes
- 📍 **Location Finder** — Locate nearby herbal gardens
- 📬 **Contact Form** — Email-based inquiry submission
- 🔐 **Admin Panel** — Manage products and stock (admin role)

---

## 🛠 Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| HTML5 / CSS3 | Structure & Styling |
| Vanilla JavaScript | Client-side logic |
| Axios | API communication |

### Backend
| Technology | Purpose |
|---|---|
| Node.js | Runtime environment |
| Express.js | Web framework |
| MongoDB Atlas | Database |
| Mongoose | ODM (Object Document Mapper) |
| JWT (jsonwebtoken) | Authentication |
| bcryptjs | Password hashing |
| Nodemailer | Email for contact form |
| express-validator | Input validation |

---

## 📁 Project Structure

```
virutal-herbal/
├── backend/
│   ├── config/
│   │   └── databases.js          # MongoDB connection
│   ├── controllers/              # Route handler logic
│   ├── middleware/
│   │   ├── auth.js               # JWT protect & admin middleware
│   │   └── errorHandler.js       # Global error handler
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Product.js            # Product schema
│   │   ├── Cart.js               # Cart schema
│   │   ├── Orders.js             # Order schema
│   │   └── Contact.js            # Contact form schema
│   └── routes/
│       ├── authRoutes.js         # /api/auth
│       ├── productRoutes.js      # /api/products
│       ├── cartRoutes.js         # /api/cart
│       ├── orderRoutes.js        # /api/orders
│       └── contactRoutes.js      # /api/contact
├── images/                       # Static image assets
├── data/                         # Seed data files
├── index.html                    # Home page
├── about.html                    # About page
├── shop.html                     # Shop / Product listing
├── search.html                   # Search page
├── ayurveda.html                 # Ayurveda information
├── siddha.html                   # Siddha information
├── unani.html                    # Unani information
├── homeopathy.html               # Homeopathy information
├── yoga.html                     # Yoga information
├── location.html                 # Garden location finder
├── contact.html                  # Contact us page
├── login.html                    # User login
├── register.html                 # User registration
├── logout.html                   # Logout page
├── api.js                        # Axios API service layer
├── styles.css                    # Global styles
├── config.js                     # Frontend config
├── seed.js                       # Database seeder script
├── server.js                     # Express server entry point
├── package.json
├── .env                          # Environment variables (not committed)
└── .gitignore
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v16 or higher
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/GOWSIK-977/Herbal_Garden.git
   cd Herbal_Garden
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**

   Create a `.env` file in the root directory (see [Environment Variables](#-environment-variables)):
   ```bash
   cp .env.example .env
   ```

4. **(Optional) Seed the database**
   ```bash
   node seed.js
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```
   The server will run at **http://localhost:5000**

6. **Open the frontend**

   Open `index.html` directly in your browser, or serve it using a static file server (e.g., VS Code Live Server extension).

---

## 🔧 Environment Variables

Create a `.env` file in the project root with the following variables:

```env
# MongoDB Connection String
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/virtual_herbal_garden

# JWT Secret Key
JWT_SECRET=your_strong_jwt_secret_here

# Server Port
PORT=5000

# Email Configuration (for contact form)
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
```

> ⚠️ **Never commit your `.env` file to version control.**

---

## 📡 API Endpoints

### Authentication — `/api/auth`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/auth/register` | Register a new user | No |
| POST | `/api/auth/login` | Login and get token | No |
| GET | `/api/auth/me` | Get current user | Yes |
| PUT | `/api/auth/update` | Update user profile | Yes |

### Products — `/api/products`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/products` | Get all products | No |
| GET | `/api/products/:id` | Get product by ID | No |
| GET | `/api/products/tag/:tag` | Get products by tag | No |
| GET | `/api/products/featured` | Get featured products | No |
| POST | `/api/products` | Create product | Admin |
| PUT | `/api/products/:id` | Update product | Admin |
| DELETE | `/api/products/:id` | Delete product | Admin |
| PATCH | `/api/products/:id/stock` | Update stock | Admin |

### Cart — `/api/cart`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| GET | `/api/cart` | Get user's cart | Yes |
| POST | `/api/cart/items` | Add item to cart | Yes |
| PUT | `/api/cart/items` | Update cart item | Yes |
| DELETE | `/api/cart/items` | Remove cart item | Yes |
| DELETE | `/api/cart/clear` | Clear cart | Yes |

### Orders — `/api/orders`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/orders` | Place an order | Yes |
| GET | `/api/orders` | Get user's orders | Yes |
| GET | `/api/orders/:id` | Get order by ID | Yes |

### Contact — `/api/contact`
| Method | Endpoint | Description | Auth |
|---|---|---|---|
| POST | `/api/contact` | Submit contact form | No |

### Health Check
| Method | Endpoint | Description |
|---|---|---|
| GET | `/health` | API health status |

---

## 🖥 Pages Overview

| Page | File | Description |
|---|---|---|
| Home | `index.html` | Landing page with featured herbs |
| Shop | `shop.html` | Product listing with cart |
| Search | `search.html` | Search and filter herbs |
| Ayurveda | `ayurveda.html` | Ayurvedic medicine system info |
| Siddha | `siddha.html` | Siddha medicine system info |
| Unani | `unani.html` | Unani medicine system info |
| Homeopathy | `homeopathy.html` | Homeopathy info |
| Yoga | `yoga.html` | Yoga & wellness info |
| Location | `location.html` | Find nearby herbal gardens |
| Contact | `contact.html` | Contact form |
| Login | `login.html` | User login |
| Register | `register.html` | User registration |
| About | `about.html` | About the project |

---

## 🗄 Database Models

| Model | Fields |
|---|---|
| **User** | name, email, passwordHash, role (user/admin), createdAt |
| **Product** | name, description, price, category, stock, images, tags, featured |
| **Cart** | userId, items[ {productId, quantity} ], updatedAt |
| **Order** | userId, items, totalPrice, status, shippingAddress, createdAt |
| **Contact** | name, email, subject, message, createdAt |

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch: `git checkout -b feature/my-feature`
3. Commit your changes: `git commit -m 'Add some feature'`
4. Push to the branch: `git push origin feature/my-feature`
5. Open a Pull Request

---

## 📄 License

This project is licensed under the **ISC License**.

---

> 🌿 *Built with passion for traditional herbal medicine and modern web technology.*
