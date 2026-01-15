// Development environment configuration
export const environment = {
  production: false,
  // Base URL for the backend REST API (no trailing slash)
  // The app will call endpoints like `${environment.apiBase}/patient`.
  apiBase: 'http://localhost:5000/api'
};
