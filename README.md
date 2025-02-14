# Dog Matching App

## Description
Dog Matching App is a React-based web application that allows users to search for dogs available for adoption based on different criteria such as breed, age, and location. Users can filter results, select their favorite dogs, and generate a match for adoption.

## Features
- **User Authentication**: Log in and manage sessions with secure authentication.
- **Search Functionality**: Search for dogs by breed, age, and other attributes.
- **Favorites**: Add or remove dogs from a favorites list.
- **Pagination**: Browse through search results via pagination.
- **Responsive Design**: Accessible on various devices, providing a consistent experience on both desktops and mobile phones.

## Tech Stack
- **Frontend**: React, Bootstrap for styling
- **APIs**: `https://frontend-take-home-service.fetch.com` for dog data
- **Deployment**: This app is hosted on Vercel

## Getting Started

### Prerequisites
Before you begin, ensure you have met the following requirements:
- Node.js and npm installed. You can download them from [nodejs.org](https://nodejs.org/).

### Installation
To install Dog Matching App, follow these steps:

1. Clone the repository:
   ```bash
   git clone https://github.com/nakisaahmadii/dog-matching-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd dog-matching-app
   ```
3. Install the necessary packages:
   ```bash
   npm install
   ```

### Running the Application
To run Dog Matching App on your local machine, execute the following command:
```bash
npm start
```
This will start the development server on `http://localhost:3000/`.

## Deployment

### Deploying to Vercel

This project is configured for easy deployment on [Vercel](https://vercel.com). To deploy:

1. **Log in to Vercel** and **import your project** from GitHub.
2. Ensure the **build settings** are detected (`npm run build` and the `build/` directory).
3. Set any **environment variables** your project requires in the Vercel project settings.
4. Vercel will automatically deploy your application upon pushing changes to your GitHub repository.

#### Live Application

The live application can be viewed [here](https://dog-adoption-app-sigma.vercel.app/).

### Important Notes

- Ensure any backend services your app relies on are accessible from your Vercel deployment.
- Consult Vercel's documentation for advanced features such as custom domains and Serverless Functions.

## Usage
After launching the app, you can:
- **Log in** using your credentials to start using the application.
- **Search** for dogs by selecting various filters.
- **Add or remove** dogs from your favorites.
- **Generate a match** for your favorite dog.


### Contributing
Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are greatly appreciated.

To contribute:
1. Fork the repository.
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`).
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`).
4. Push to the Branch (`git push origin feature/AmazingFeature`).
5. Open a Pull Request.



- Project Link: [https://github.com/nakisaahmadii/dog-matching-app](https://github.com/nakisaahmadii/dog-matching-app)