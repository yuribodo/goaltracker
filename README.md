# Goal Tracker

Welcome to **GoalTracker**, a powerful tool designed to help you set, track, and achieve your goals efficiently. Whether for personal, professional, or academic objectives, GoalTracker provides an intuitive interface and robust features to manage your goals effectively.

With GoalTracker, you can:
- **Set Goals**: Create clear and specific goals with detailed descriptions.
- **Manage Tasks**: Add and track tasks related to each goal, with progress status.
- **Visualize Progress**: Use charts and progress bars to monitor your advancement in real-time.

  **You can start Usign right now at:** [Goal Tracker Link](https://goaltracker-xi.vercel.app/)

## Table of Contents

- [Introduction](#introduction)
- [Technologies Used](#technologies-used)
  - [Frontend](#frontend)
  - [Backend](#backend)
- [Installation](#installation)
- [Running the Application](#running-the-application)
- [Conclusion](#conclusion)
- [Environment Variables](#environment-variables)

## Introduction

GoalTracker is perfect for individuals seeking an organized and visually appealing way to manage their goals and tasks. Explore the platform and start turning your aspirations into tangible achievements!

## Initial Page
![Screenshot 2024-08-07 204210](https://github.com/user-attachments/assets/958d15ad-9cff-460a-ba4c-4b092288b52e)

## Main Page
![Screenshot 2024-08-07 204641](https://github.com/user-attachments/assets/4fdd17dd-85ca-468b-8756-861b54bcde65)


## Technologies Used

### Frontend

- **React**: A JavaScript library for building user interfaces. It allows us to create reusable UI components.
- **TypeScript**: A superset of JavaScript, offering static type-checking and the latest ECMAScript features.
- **TailwindCSS**: A utility-first CSS framework packed with classes like `flex`, `pt-4`, `text-center` and more to style your websites without leaving your HTML.
- **Next.js**: A React framework for building server-rendered and static web applications.
- **Axios**: A promise-based HTTP client for making requests to APIs.
- **Framer Motion**: A library for adding animations to React components.
- **jwt-decode**: A library for decoding JWTs (JSON Web Tokens) to extract information.

### Backend

- **Node.js**: A JavaScript runtime built on Chrome's V8 JavaScript engine.
- **Express**: A minimal and flexible Node.js web application framework that provides a robust set of features for web and mobile applications.
- **TypeScript**: Brings static typing to JavaScript, ensuring a more predictable runtime behavior.
- **PostgreSQL**: A powerful, open-source object-relational database system.
- **Nodemon**: A utility that monitors for any changes in your source and automatically restarts your server.
- **Prisma**: An open-source database toolkit that simplifies database access and management.
- **bcryptjs**: A library for hashing passwords securely.


## Installation

Before you start, ensure you have `node` and `npm` installed on your machine. 

1. **Clone the repository**:
   
   ```bash
   git clone https://github.com/yuribodo/goaltracker.git
   ```

2. **Navigate to the repository**:

   ```bash
   cd goaltracker
   ```

3. **Install the dependencies**:

   - For Frontend:
   
     ```bash
     cd Front && npm install
     ```

   - For Backend:

     ```bash
     cd Back && npm install
     ```

## Running the Application

- **To run the frontend**:

  ```bash
  cd Front
  npm run dev
  ```

  This starts the React application on `http://localhost:3000` (or another available port).

- **To run the backend**:

  ```bash
  cd Back
  npm run dev
  ```

  This initializes the Express server, typically on `http://localhost:8080`.

Ensure that the frontend and backend are configured to run on separate ports to avoid conflicts.

## Environment Variables

Both the frontend and backend applications require environment variables to be configured. Create the following .env files with the necessary settings:

Frontend .env: Place this file in the Front directory.

- **.env**
```bash
   NEXT_PUBLIC_API_URL=http://localhost:8080
  ```

Backend .env: Place this file in the Back directory.

- **.env**
 ```bash
   DATABASE_URL={your postgress database}
  ```


Make sure to replace placeholders with your actual configuration values.

## Conclusion

Thank you for exploring **GoalTracker**! We hope this tool helps you achieve your goals and stay organized in your journey towards success. 

We are continuously working to enhance GoalTracker with new features and improvements. Your feedback and suggestions are valuable to us, so feel free to contribute and let us know how we can make your experience even better.

Happy goal-setting and tracking!

---

If you find any bugs or have a feature request, please open an issue on [GitHub](https://github.com/yuribodo/goaltracker/issues).

**Made with ❤️ by [Yuri Bodo](https://github.com/yuribodo)**.
