# Cinetra

Have you ever started a TV show and then made a long pause to come back to it but don't remember at which season or episode you stopped watching?

Have you ever had a long watchlist, and you forget which movie you wanted to watch?

Cinetra is here to provide a set of solutions for the management of your watch progress.

## Getting Started

### Prerequisites

To be able to run cinetra, you need :

* Node.js (>= 20.7.0)
* npm (>= 10.1.0)
* MongoDB (>= 7.0.0)

### Installation

Clone the repository :

```bash
git clone https://github.com/Yan-ni/cinetra.git
```

Change the working directory to the project directory:

```bash
cd cinetra
```

Install backend dependencies :

```bash
npm install
```

Install frontend dependencies :

```bash
cd frontend
npm install
```

## Usage

### Configuration

Setup frontend environement variables :

```bash
VITE_API_PATH=http://localhost:$PORT
```

> note that the $PORT parameter references the backend port.

Setup backend environement variables :

```bash
PORT=$PORT
DB_CONNECTION_STRING=mongodb://127.0.0.1:27017/$DB_NAME
NODE_ENV='production' | 'developement'
```

### Running the Application

To run the application you need to run the following :

Run the backend :

```bash
npm run dev
```

Run the frontend :

```bash
cd frontend
npm run dev
```
