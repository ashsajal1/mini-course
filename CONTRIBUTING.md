# Contributing to Mini Course Platform

First off, thanks for taking the time to contribute! 🎉

The following is a set of guidelines for contributing to the Mini Course Platform. These are mostly guidelines, not rules. Use your best judgment, and feel free to propose changes to this document in a pull request.

## 🚀 Getting Started

### Prerequisites

- **Node.js**: v18.0.0 or later
- **Package Manager**: [pnpm](https://pnpm.io/) (recommended), npm, or yarn
- **Database**: PostgreSQL

### Installation

1.  **Fork the repository** on GitHub.
2.  **Clone your fork** locally:
    ```bash
    git clone https://github.com/YOUR_USERNAME/mini-course.git
    cd mini-course
    ```
3.  **Install dependencies**:
    ```bash
    pnpm install
    ```
4.  **Set up environment variables**:
    - Copy `.env.example` to `.env`:
      ```bash
      cp .env.example .env
      ```
    - Update `.env` with your PostgreSQL connection string and other required variables.
5.  **Run database migrations**:
    ```bash
    pnpm prisma migrate dev
    ```
6.  **Start the development server**:
    ```bash
    pnpm dev
    ```
    The app should now be running at [http://localhost:3000](http://localhost:3000).

## 🛠️ Development Workflow

1.  **Create a branch** for your changes:
    ```bash
    git checkout -b feature/amazing-feature
    # or
    git checkout -b fix/annoying-bug
    ```
    - Use `feature/` for new features.
    - Use `fix/` for bug fixes.
    - Use `docs/` for documentation changes.

2.  **Make your changes**.
3.  **Run linting** to ensure code quality:
    ```bash
    pnpm lint
    ```
4.  **Commit your changes**:
    - We follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.
    - Format: `<type>(<scope>): <description>`
    - Examples:
        - `feat(auth): add google login support`
        - `fix(course): resolve crash on empty module`
        - `docs: update readme installation steps`

## 📮 Pull Request Process

1.  **Push your branch** to your fork:
    ```bash
    git push origin feature/amazing-feature
    ```
2.  **Open a Pull Request** against the `main` branch of the original repository.
3.  **Description**: Clearly describe the problem you are solving and your proposed solution. Link to any relevant issues.
4.  **Review**: Wait for a maintainer to review your PR. Be ready to address any feedback.

## 🎨 Coding Standards

- **Framework**: We use [Next.js 16](https://nextjs.org/) with the App Router.
- **Language**: TypeScript. Please avoid `any` types whenever possible.
- **Styling**: [Tailwind CSS](https://tailwindcss.com/). Use utility classes over custom CSS where possible.
- **Database**: [Prisma](https://www.prisma.io/) with PostgreSQL.
- **Linting**: We use ESLint. Ensure your code passes `pnpm lint` before submitting.

## 🐞 Reporting Issues

If you find a bug or have a feature request, please open an issue on GitHub.
- **Bugs**: Include steps to reproduce, expected behavior, and actual behavior.
- **Features**: Describe the feature and why it would be useful.

## 📜 License

By contributing, you agree that your contributions will be licensed under its MIT License.
