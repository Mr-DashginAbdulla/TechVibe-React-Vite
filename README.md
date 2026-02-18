# TechVibe 🚀

**TechVibe** is a modern, full-stack e-commerce solution designed to provide a seamless shopping experience for customers and a powerful management interface for administrators. Built with cutting-edge web technologies, it features a responsive customer storefront and a comprehensive admin dashboard.

---

## 🌟 Features

### 🛍️ User Storefront (Client Side)

- **Modern UI/UX**: Aesthetic design with **Dark/Light mode** support, glassmorphism effects, and smooth animations using **Framer Motion**.
- **Product Discovery**: Advanced filtering, search with recent history, and category navigation.
- **Shopping Experience**: Real-time cart management, wishlist functionality, and a smooth checkout process.
- **User Accounts**: Authentication system, profile management, order history, and address book.
- **Performance**: Optimized for speed with **Lenis** smooth scrolling and efficient state management.
- **Localization**: Multi-language support (i18n) for a global reach.

### 🛠️ Admin Dashboard

- **Analytics**: Visual dashboard displaying sales stats, user growth, and revenue data.
- **Product Management**: Full CRUD capabilities for products and categories.
- **Order Control**: Manage order statuses (Pending, Shipping, Delivered) and view detailed order history.
- **User Management**: Monitor and manage registered users.
- **Global Settings**: Configure platform-wide settings and brands.

---

## 🏗️ Architecture & Tech Stack

The project is structured as a monorepo containing three main components:

### 1. **Client / Storefront (`/ui`)**

- **Framework**: [React 19](https://react.dev/) + [Vite](https://vitejs.dev/)
- **Styling**: [TailwindCSS v4](https://tailwindcss.com/)
- **State Management**: [Redux Toolkit](https://redux-toolkit.js.org/) & RTK Query
- **Animations**: [Framer Motion](https://www.framer.com/motion/) & [Lenis](https://lenis.darkroom.engineering/) (Smooth Scroll)
- **Routing**: React Router v7
- **Internationalization**: i18next & react-i18next
- **Helpers**: React Helmet Async (SEO), Lucide React (Icons), React Toastify (Notifications)

### 2. **Admin Panel (`/admin`)**

- **Framework**: React 19 + Vite
- **Styling**: TailwindCSS v4
- **State Management**: Redux Toolkit
- **Charts**: Custom analytic visualizations
- **Icons**: Lucide React

### 3. **Backend / Server (`/server`)**

- **Core**: Node.js & [JSON Server](https://github.com/typicode/json-server) (REST API simulation)
- **Features**: Custom middleware for Authentication (Login/Register) and Read-Only data protection.
- **Database**: `db.json` (NoSQL-like local JSON database)

---

## 🚀 Getting Started

To get a local copy up and running, follow these simple steps.

### Prerequisites

- Node.js (v18+)
- npm or yarn

### Installation

1.  **Clone the repo**

    ```sh
    git clone https://github.com/your_username/techvibe.git
    cd techvibe
    ```

2.  **Install Dependencies** (for all workspaces)

    ```sh
    cd server && npm install
    cd ../admin && npm install
    cd ../ui && npm install
    ```

3.  **Configuration**
    Create `.env` files in both `admin` and `ui` directories:

    ```env
    VITE_API_URL=http://localhost:3000
    ```

4.  **Run the App**
    Open 3 separate terminals:
    - **Server**: `cd server && node server.js`
    - **Admin**: `cd admin && npm run dev`
    - **UI**: `cd ui && npm run dev`

For a detailed step-by-step guide on setup, building, and deployment, please refer to the **[DEV_GUIDE.md](./DEV_GUIDE.md)** included in this repository.

---

## 🔮 Roadmap

- [ ] Integration with real payments (Stripe/PayPal)
- [ ] Migration from JSON Server to MongoDB/PostgreSQL
- [ ] Next.js migration for SSR and better SEO
- [ ] Mobile App (React Native)

---

## 👤 Author

**Dashgın Abdulla**

- LinkedIn: [Dashgın Abdulla](https://linkedin.com/in/dashgin-abdulla)
- GitHub: [@Mr-DashginAbdulla](https://github.com/Mr-DashginAbdulla)

---

_Built with ❤️ using React & TailwindCSS_
