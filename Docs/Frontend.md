# Frontend Architecture

## Technology Stack

| Library | Purpose |
|---------|---------|
| React 19 | UI library |
| Vite | Build tool and dev server |
| React Router | Client-side routing |
| Tailwind CSS | Styling |
| Axios | HTTP client |
| Recharts | Data visualization |
| Lucide React | Icons |
| React Hot Toast | Notifications |
| date-fns | Date formatting |

## Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── DashboardLayout.jsx    # Main layout wrapper
│   └── ProtectedRoute.jsx     # Auth route guards
├── contexts/            # React contexts
│   └── AuthContext.jsx        # Authentication state
├── lib/                 # Utility libraries
│   └── api.js                 # Axios instance config
├── pages/               # Page components
│   ├── Dashboard.jsx         # Home dashboard
│   ├── auth/
│   │   ├── Login.jsx
│   │   ├── Register.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── ResetPassword.jsx
│   │   └── VerifyEmail.jsx
│   ├── workouts/
│   │   └── Workouts.jsx
│   ├── diet/
│   │   └── Diet.jsx
│   ├── progress/
│   │   └── Progress.jsx
│   └── profile/
│       └── Profile.jsx
└── services/            # API service layer
    ├── authService.js
    ├── workoutService.js
    ├── dietService.js
    └── progressService.js
```

## Routing

| Path | Component | Access |
|------|-----------|--------|
| `/login` | Login | Public |
| `/register` | Register | Public |
| `/forgot-password` | ForgotPassword | Public |
| `/reset-password/:token` | ResetPassword | Public |
| `/verify-email/:token` | VerifyEmail | Public |
| `/dashboard` | Dashboard | Protected |
| `/workouts` | Workouts | Protected |
| `/diet` | Diet | Protected |
| `/progress` | Progress | Protected |
| `/profile` | Profile | Protected |

## Authentication Flow

1. User registers/logs in
2. Server returns access token + refresh token (in cookies)
3. Access token stored in localStorage for API calls
4. Token attached to requests via Axios interceptor
5. On 401 response, interceptor attempts token refresh
6. If refresh fails, redirect to login

## State Management

- `AuthContext` provides global auth state
- Local state with `useState` for component data
- No global state library needed (app is small)

## Styling

- Tailwind CSS for utility-first styling
- Responsive design with mobile breakpoints
- Custom teal/cyan color scheme
- Consistent 8px spacing system

## API Integration

All API calls use the centralized Axios instance:

```javascript
import api from '../lib/api';

// GET request
const response = await api.get('/workout');

// POST request
await api.post('/workout', { type: 'running', duration: 30 });

// With auth (automatic)
api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
```

## Building for Production

```bash
npm run build
```

Output: `dist/` folder ready for static hosting.
