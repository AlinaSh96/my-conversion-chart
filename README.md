# Conversion Chart

Interactive React application for visualizing A/B testing data with conversion rate charts.

🔗 **Live Demo**: https://alinash96.github.io/my-conversion-chart/

## Features

- **Interactive Charts** — Built with Recharts for smooth data visualization
- **Multiple Line Styles** — Line, Smooth, and Area rendering modes
- **Theme Support** — Light and Dark mode toggle
- **Zoom Controls** — Pan and zoom to explore data in detail
- **Data Aggregation** — View data by day or week
- **Variation Filtering** — Select specific variations or view all at once
- **Error Boundary** — Graceful error handling
- **Performance Optimized** — React.memo and memoization for efficient rendering
- **Custom Tooltip** — Shows formatted dates and conversion rates with "No Data" indication
- **PNG Export** — Export charts as high-quality images
- **Internationalization Ready** — Centralized translations system

## Development

```bash
# Install dependencies
npm install

# Run dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Project Structure

```
src/
├── components/
│   ├── Chart/
│   │   ├── ConversionChart/    # Main chart component
│   │   └── CustomTooltip/      # Custom tooltip with formatting
│   ├── Controls/               # UI controls (zoom, filters, selectors)
│   ├── Common/                 # ErrorBoundary
│   └── ExportButton/           # PNG export functionality
├── hooks/
│   └── useData.ts              # Data loading and transformation
├── lib/
│   └── dataTransform.ts        # Data transformation utilities
├── types/                      # TypeScript type definitions
├── constants/
│   ├── colors.ts               # Theme colors and palette
│   ├── chart.ts                # Chart configuration
│   └── translations.ts         # UI text translations
└── pages/
    └── Main.tsx                # Main page with state management
```

## Data Format

Data is loaded from `public/data.json`. Expected format:

```json
{
  "variations": [
    { "name": "Original" },
    { "id": 10001, "name": "Variation A" }
  ],
  "data": [
    {
      "date": "2025-01-01",
      "visits": { "0": 1866, "10001": 1957 },
      "conversions": { "0": 158, "10001": 463 }
    }
  ]
}
```

Conversion rates are calculated as `(conversions / visits) * 100`.

## Technologies

- **React 19** — UI library
- **TypeScript** — Type safety
- **Vite** — Fast build tool
- **Recharts** — Charting library
- **date-fns** — Date formatting and manipulation
- **html-to-image** — Chart export functionality
- **React Compiler** — Automatic rendering optimization

## Key Behaviors

- **Missing Data Handling**: When a variation has missing data points, they are rendered as `null`. For single variation view, points are connected (`connectNulls`). For "All variations" view, gaps are shown to indicate missing data.
- **Responsive Layout**: Controls wrap on smaller screens; chart adapts to container size.
- **Axis Adaptation**: X-axis range adjusts based on selected variation's available data.

## License

MIT
```
