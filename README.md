# ReporterApp

ReporterApp is a web-based application that allows users to manage and view reports with file attachments. It includes a **frontend** for user interaction and a **backend** for handling data storage and retrieval.

---

## Features

- **View Reports**: View detailed information about reports, including file attachments.
- **Edit Reports**: Update report information and replace or remove attached files.
- **Delete Reports**: Permanently delete reports.
- **File Uploads**: Upload and manage files associated with reports.

---

## Project Structure

The project is divided into two main folders:

### 1. **Frontend**

- Built using **React** and **Vite**.
- Uses **Material-UI (MUI)** for responsive and modern UI components.
- Manages state with **Redux Toolkit**.

### 2. **Backend**

- Built with **Node.js** and **TypeScript**.
- Uses **Supabase** for database and file storage.
- REST API routes to handle CRUD operations.

---

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) and npm installed.
- Environment variables for Supabase configured in a `.env` file:
  ```bash
  SUPABASE_URL=<your-supabase-url>
  SUPABASE_KEY=<your-supabase-key>
  ```

### Installation

# Install backend dependencies

cd backend
npm install

# Install frontend dependencies

cd frontend
npm install

### Running the application

npm run start
