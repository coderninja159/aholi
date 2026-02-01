# Google Apps Script deployment guide (Aholi Muammolari)

## 1. Create the Google Sheet

1. Go to [Google Sheets](https://sheets.google.com) and create a **new spreadsheet**.
2. Name it (e.g. "Aholi Muammolari").
3. In the first sheet, set the **first row** to these headers (exact):

   | A   | B      | C        | D           | E     | F         |
   |-----|--------|----------|-------------|-------|-----------|
   | id  | region | category | description | votes | createdAt |

4. (Optional) Rename the sheet tab to **Problems** (or keep default and set `SHEET_NAME = 'Sheet1'` in `Code.gs`).

---

## 2. Create the Apps Script project

1. In the spreadsheet menu: **Extensions → Apps Script**.
2. Delete any default code in `Code.gs`.
3. Copy the full contents of **`/apps-script/Code.gs`** from this repo and paste into `Code.gs`.
4. If your sheet tab is not named "Problems", change the first line of `getSheet()`:

   ```js
   var SHEET_NAME = 'YourSheetTabName'
   ```

5. **File → Save** (or Ctrl+S). Name the project if prompted (e.g. "Aholi Backend").

---

## 3. Deploy as Web App

1. Click **Deploy → New deployment**.
2. Click the gear icon next to "Select type" and choose **Web app**.
3. Set:
   - **Description:** e.g. "v1"
   - **Execute as:** **Me** (your Google account).
   - **Who has access:** **Anyone** (so the frontend can call it without login).
4. Click **Deploy**.
5. **Authorize** when asked: choose your Google account and allow the requested permissions.
6. Copy the **Web app URL** (looks like `https://script.google.com/macros/s/XXXX/exec`). This is your **API URL**.

---

## 4. Paste API URL into the frontend

1. Open **`src/config.js`** in this repo.
2. Set the API URL:

   ```js
   export const API_URL = 'https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec'
   ```

   Or use an env file: create **`.env`** in the project root:

   ```
   VITE_API_URL=https://script.google.com/macros/s/YOUR_DEPLOYMENT_ID/exec
   ```

   Then in `src/config.js` keep:  
   `export const API_URL = import.meta.env.VITE_API_URL || ''`

---

## 5. Test with curl

Replace `YOUR_URL` with your Web app URL.

- **List problems:**
  ```bash
  curl "YOUR_URL?action=list"
  ```
  Expect: `[]` or a JSON array of problems.

- **Submit a problem:**
  ```bash
  curl -X POST "YOUR_URL" \
    -H "Content-Type: application/json" \
    -d '{"action":"submit","region":"Toshkent shahri","category":"Suv muammosi","description":"Test"}'
  ```
  Expect: `{"id":"p...","ok":true}`.

- **Vote:**
  ```bash
  curl -X POST "YOUR_URL" \
    -H "Content-Type: application/json" \
    -d '{"action":"vote","id":"p1234567890_abc123"}'
  ```
  Use an `id` returned from the list or submit. Expect: `{"ok":true,"votes":1}`.

---

## Troubleshooting

| Issue | What to check |
|-------|----------------|
| **CORS errors** in browser | `Code.gs` must set `Access-Control-Allow-Origin: *` (already in this script). Redeploy after changing. |
| **405 / Method not allowed** | Use GET for `?action=list` and POST for submit/vote. For POST, send JSON body with `action` and other fields. |
| **"Invalid action"** | GET: use query `action=list`. POST: body must be JSON with `action: "submit"` or `action: "vote"`. |
| **Permissions / "Authorization required"** | Deploy as **Me**, access **Anyone**. First run may ask you to authorize the app. |
| **Old behavior after code change** | Create a **new deployment** (Deploy → Manage deployments → Edit → New version → Deploy). Browsers may cache the previous URL; use the latest Web app URL. |
| **Sheet not found** | In `Code.gs`, set `SHEET_NAME` to the exact name of the sheet tab that has the headers. |

---

## Sheet column schema (reference)

| Column     | Type   | Description                    |
|-----------|--------|--------------------------------|
| id        | string | Unique id (e.g. p1738..._abc)  |
| region    | string | Region name                    |
| category  | string | Category (default Boshqa)      |
| description | string | Problem description          |
| votes     | number | Vote count                     |
| createdAt | string | ISO date when created         |
