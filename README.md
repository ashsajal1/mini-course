# Mini Course Platform

A modern, interactive e-learning platform built with Next.js, React, and Prisma. This platform allows users to browse and take courses online with a clean, user-friendly interface.

## 🚀 Live Demo

Check out the live demo: [https://minicourse.netlify.app/](https://minicourse.netlify.app/)

## ✨ Features

- Modern, responsive design with dark/light mode support
- Interactive course content with markdown support
- Real-time progress tracking
- User authentication and course enrollment
- Clean and intuitive user interface
- Built with Next.js App Router
- TypeScript for type safety
- Prisma ORM for database operations
- Tailwind CSS for styling

## 🛠️ Tech Stack

- **Frontend**: Next.js 16, React 19, TypeScript
- **Styling**: Tailwind CSS, DaisyUI
- **Database**: PostgreSQL with Prisma ORM
- **Deployment**: Netlify
- **Form Handling**: React Hook Form with Zod validation
- **Icons**: Lucide React
- **Markdown**: React Markdown with syntax highlighting

## 🚀 Getting Started

### Prerequisites

- Node.js 18.0.0 or later
- pnpm (recommended) or npm/yarn
- PostgreSQL database

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/ashsajal1/mini-course.git
   cd mini-course
   ```

2. Install dependencies:
   ```bash
   pnpm install
   # or
   npm install
   # or
   yarn install
   ```

3. Set up environment variables:
   - Copy `.env.example` to `.env`
   - Update the database connection string and other environment variables

4. Run database migrations:
   ```bash
   pnpm prisma migrate dev
   ```

5. Start the development server:
   ```bash
   pnpm dev
   ```

6. Open [http://localhost:3000](http://localhost:3000) in your browser

## 📦 Scripts

- `dev`: Start development server
- `build`: Build the application for production
- `start`: Start production server
- `lint`: Run ESLint
- `postinstall`: Generate Prisma client

## 🌐 Deployment

The application is deployed on Netlify. To deploy your own instance:

1. Fork this repository
2. Connect your Netlify account to your GitHub repository
3. Configure the build settings:
   - Build command: `pnpm build`
   - Publish directory: `.next`
4. Add required environment variables
5. Deploy!

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
