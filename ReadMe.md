# Setup

## Initial Setup

1. **Open Puppeteer in the Same Window:**

   - [Follow the instructions in this Medium article](https://medium.com/@jaredpotter1/connecting-puppeteer-to-existing-chrome-window-8a10828149e0) to open Puppeteer in an existing Chrome window.

2. **Get `webSocketDebuggerUrl` from the Following URL:**

   - Open [this](http://127.0.0.1:9222/json/version) in the Chrome browser (use the shortcut you created in the previous step).
   - Retrieve the `webSocketDebuggerUrl` from the JSON response.

3. **Add `webSocketDebuggerUrl` to `.env` File:**

   - Inside the backend folder root, create or edit the `.env` file.
   - Add the following variable:
     ```
     CHROME_URI=<webSocketDebuggerUrl>
     ```
     Replace `<webSocketDebuggerUrl>` with the actual value you obtained.

4. **Build the Front End:**
   - Navigate to the root of your UI folder.
   - Run `npm run build`.
