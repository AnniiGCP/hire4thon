# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Oxc](https://oxc.rs)
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.

## Submission Streak Integration (Home Page)

The Submission Streak heatmap on the Home page is now API-ready and can consume backend data directly.

### What was added

- Data service: `src/services/submissionStreakService.js`
- Home page integration: `src/pages/HomePage.jsx`

### Endpoint used

- `GET /api/submission-streak`

If needed, set a custom API base URL using:

- `VITE_API_BASE_URL`

Example:

```env
VITE_API_BASE_URL=http://localhost:8080
```

### Response contract

```json
{
	"dayLabels": ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
	"months": [
		{ "label": "Sep", "col": 1 },
		{ "label": "Oct", "col": 6 }
	],
	"levels": [0, 1, 2, 3, 4],
	"streakWeeks": 16
}
```

Notes:

- `dayLabels` should contain exactly 7 entries.
- `levels` are clamped to the range `0..4`.
- Heatmap supports 7 rows x 52 columns (364 cells expected).

### Fallback behavior

If the API request fails or returns incomplete data, the UI falls back to built-in mock data so the heatmap still renders safely.
