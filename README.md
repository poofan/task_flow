# Task Flow - Kanban Board Application

A modern Kanban board application built with React, TypeScript, and Material-UI. This application provides a Trello-like interface for managing tasks and projects.

## Features

- Create and manage multiple boards
- Drag-and-drop task management
- Task labels and deadlines
- Real-time collaboration
- User authentication
- Responsive design

## Prerequisites

- Node.js (v14 or higher)
- npm (v6 or higher)
- Firebase account (for authentication and real-time database)

## Setup

1. Clone the repository:
```bash
git clone https://github.com/yourusername/task-flow.git
cd task-flow
```

2. Install dependencies:
```bash
npm install
```

3. Create a Firebase project and enable Authentication and Firestore.

4. Create a `.env` file in the root directory with your Firebase configuration:
```
REACT_APP_FIREBASE_API_KEY=your_api_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_auth_domain
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_storage_bucket
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

5. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`.

## Project Structure

```
src/
  ├── components/     # Reusable UI components
  ├── features/      # Feature-specific components and logic
  ├── hooks/         # Custom React hooks
  ├── layouts/       # Layout components
  ├── services/      # External service integrations
  ├── store/         # Redux store configuration
  ├── types/         # TypeScript type definitions
  └── utils/         # Utility functions
```

## Technologies Used

- React
- TypeScript
- Material-UI
- Redux Toolkit
- Firebase
- React Beautiful DnD
- React Router
- Day.js

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the LICENSE file for details.
