# Eventful API

## Overview

Eventful API is a backend event management platform built with NestJS, Prisma, PostgreSQL, JWT Authentication, and Swagger documentation.

The application allows users to:

* Register and authenticate accounts
* Create and manage events
* Purchase event tickets
* Generate QR-code tickets
* Scan tickets at event entry
* Prevent duplicate ticket scans
* Leave reviews
* Manage favorites
* View analytics
* Receive notifications
* Schedule reminders

---

## Tech Stack

* NestJS
* TypeScript
* Prisma ORM
* PostgreSQL
* JWT Authentication
* Swagger/OpenAPI
* Cloudinary
* Nodemailer
* Render Deployment

---

## Features

### Authentication

* User registration
* User login
* JWT-based authorization
* Role-based access control

### Events

* Create events
* Update events
* Delete events
* Browse events
* Event categories

### Tickets

* Purchase tickets
* QR code generation
* Ticket scanning
* Duplicate scan prevention

### Reviews

* Create reviews
* View reviews

### Favorites

* Add favorite events
* Remove favorite events

### Notifications

* User notifications

### Analytics

* Event analytics endpoints

---

## API Documentation

Swagger documentation is available at:

/api

after starting the application.

---

## Deployment

The project is deployed on Render.

### Email Notification Note

Email notification functionality has been implemented using Nodemailer.

However, SMTP connections are restricted on the Render free instance used for deployment. Because of this limitation, email sending was disabled in the production deployment to ensure all other application features remain fully functional.

The email service code remains implemented and can be enabled when deploying to a platform or hosting plan that allows outbound SMTP connections.

---

## Demonstrated Workflow

1. User Registration
2. User Login
3. Event Creation
4. Event Listing
5. Ticket Purchase
6. QR Code Generation
7. Ticket Scan Validation
8. Duplicate Scan Prevention

---

## Author

Developed as an academic full-stack backend project using NestJS and PostgreSQL.
