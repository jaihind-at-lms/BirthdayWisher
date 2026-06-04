# LMS - Birthday Wisher

Automated birthday card generator. Reads employee data from Google Sheets, generates personalized birthday cards with templates, and saves them locally.

## Setup

### 1. Install dependencies

```bash
npm install
```

### 2. Environment variables

Copy `.env.example` to `.env` and fill in:

```env
NTFY_TOPIC="lms-birthdaywisher"
GOOGLE_SHEET_ID="your-google-sheet-id"
GOOGLE_SHEET_EMPLOYEE_TAB="Employees"
```

| Variable | Description |
|---|---|
| `NTFY_TOPIC` | ntfy.sh topic for log notifications |
| `GOOGLE_SHEET_ID` | ID of the Google Sheet containing employee data |
| `GOOGLE_SHEET_EMPLOYEE_TAB` | Sheet tab name (default: `Employees`) |

### 3. Service account

`settings.json` at project root with Google service account credentials. Share your Google Sheet with the service account email (e.g. `google-sheet-integration@xxx.iam.gserviceaccount.com`).

### 4. Templates

Place background images in `src/templates/`. Supported formats: PNG, JPG.

### 5. Employee image

Place a test employee photo at `tests/employee.jpeg` for previews.

## Run

```bash
npm run dev     # dev mode with nodemon
npm start       # production
```

Server runs on `http://localhost:3000`.

## Routes

| Method | Path | Description |
|---|---|---|
| `GET` | `/health` | Health check |
| `GET` | `/api/birthday-wisher/status` | Job info and schedule |
| `GET` | `/api/birthday-wisher/trigger` | Run birthday wisher job (fetches employees, generates cards) |
| `GET` | `/api/birthday-wisher/preview` | Generate one card per template using `tests/employee.jpeg` |

Cards are saved to `birthday-cards/` folder.

## Template Config

Edit `src/config/template-config.json` to define layouts per template.

### AI Prompt to generate config

> Here are some birthday card background templates. For each template, identify the best positions for: the employee photo, the "Happy Birthday" greeting text, the employee name, and a birthday quote. Generate the config in the format below.

### Config Structure

```json
{
  "canvas": { "width": 1080, "height": 1080 },
  "templates": [
    {
      "file": "template-1.png",
      "photo": {
        "cx": 0.50,
        "cy": 0.38,
        "size": 0.28,
        "shape": "circle",
        "borderColor": "#ffffff",
        "align": "center"
      },
      "greeting": {
        "cx": 0.50,
        "cy": 0.15,
        "fontSize": 60,
        "color": "#FFFFFF",
        "bold": false,
        "align": "center"
      },
      "name": {
        "cx": 0.50,
        "cy": 0.60,
        "fontSize": 54,
        "color": "#FFFFFF",
        "bold": true,
        "align": "center"
      },
      "quote": {
        "cx": 0.50,
        "cy": 0.72,
        "fontSize": 28,
        "color": "#FFFFFF",
        "maxWidth": 700,
        "bold": false,
        "align": "center"
      }
    }
  ]
}
```

### Field Reference

#### `photo`

| Field | Type | Default | Description |
|---|---|---|---|
| `cx` | number (0-1) | auto* | X position (fraction of canvas width) |
| `cy` | number (0-1) | — | Y position (fraction of canvas height) |
| `size` | number (0-1) | — | Photo size as fraction of canvas width |
| `shape` | string | `"circle"` | `"circle"`, `"rounded"`, or `"square"` |
| `borderColor` | string | `"#000000"` | Border color around photo |
| `align` | string | `"center"` | `"center"`, `"left"`, or `"right"` |

#### `greeting` / `name` / `quote`

| Field | Type | Default | Description |
|---|---|---|---|
| `cx` | number (0-1) | auto* | X position (fraction of canvas width) |
| `cy` | number (0-1) | — | Y position (fraction of canvas height) |
| `fontSize` | number | 52/36/28 | Font size in pixels |
| `color` | string | `"#FFFFFF"` | Text color (any CSS color) |
| `bold` | boolean | `false` | Bold text |
| `maxWidth` | number | 750 | Max text width before wrapping (quote only) |
| `align` | string | `"center"` | `"center"`, `"left"`, or `"right"` |

\* `cx` auto-defaults: `align: "center"` → `0.5`, `align: "left"` → `0.05`, `align: "right"` → `0.95`

All position values (`cx`, `cy`, `size`) are fractions of canvas dimensions (0.0 – 1.0), making configs resolution-independent.
