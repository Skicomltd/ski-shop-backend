# Skicom Shop API Server

A modular and extensible **Human Resources Management System** built with **NestJS**, designed for white-label deployment across multiple organizations. The system supports payroll, notifications, employee management, and more, with strong emphasis on scalability and clean architecture.

---

## 🚀 Start Here

Before diving in, make sure you check the following resources:

* **📖 Project Documentation** – detailed architecture, module design, and API references:
  [Project Docs](https://docs.google.com/document/d/1trVcEsFUoAjeJ8Rg4vot8e6YrBk5Wy2e5RWShI7Cni4/edit?tab=t.kuhzvdkdzi40#heading=h.5epkitc2empq)

* **📝 Contributing Guidelines** – rules, standards, and best practices for contributing:
  [CONTRIBUTING.md](./CONTRIBUTING.md)

> We highly recommend reading both before adding features, fixing bugs, or creating modules. This ensures consistency and avoids circular dependencies or runtime issues.

---

## 🚀 Features

* **Employee Management** – handle employee profiles and role assignment.
* **Payroll Processing** – approval workflows, payroll runs, and payslip management.
* **Notifications** – in-app, email, SMS, and push notifications.
* **Events & Queues** – central registries for consistent event and queue naming across the system.
* **White-label Ready** – reusable modules and configurable setup for multi-tenant deployments.

---

## 🛠 Tech Stack

* **Backend Framework**: [NestJS](https://nestjs.com/)
* **Database**: PostgreSQL (via TypeORM)
* **Queues**: [BullMQ](https://docs.bullmq.io/) with Redis
* **Events**: [@nestjs/event-emitter](https://github.com/nestjs/event-emitter)
* **Notifications**: Email, SMS, Expo push, and WebSocket real-time updates
* **Deployment**: GitHub Actions → DigitalOcean Droplet

---

## 🔧 Getting Started

### Prerequisites

* Node.js 20+
* PostgreSQL
* Redis (for queues)

### Installation

```bash
# Clone the repo
git clone https://github.com/techstudioconsults/hr-backend.git

# Install dependencies
npm install
```

### Environment Setup

1. Copy the sample file to create your local environment file:

```bash
cp .env.sample .env
```

2. Update the `.env` file with your local configuration (database, Redis, port, etc.) as needed.

> The `.env.sample` file contains all required environment variables with example values to get you started.

---

### Run the App

```bash
# Development
npm run dev

# Production
npm run build
npm run prod
```

---

## ✅ Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-module`)
3. Commit your changes (`git commit -m 'feat: added new module'`)
4. Push to the branch (`git push origin feature/new-module`)
5. Open a Pull Request

---

## 📜 License

This project is licensed under the MIT License.

---
