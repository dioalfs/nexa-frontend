# How to Check CSS Loading and Console Errors in Browser Developer Tools

This guide will help you verify if the CSS file is loading properly and if there are any errors affecting the display of the hamburger button.

## Step 1: Open Browser Developer Tools
- On Chrome, Edge, or Firefox, press `F12` or right click anywhere on the page and select "Inspect" or "Inspect Element".
- A developer tools panel will open, usually docked to the side or bottom of the browser window.

## Step 2: Check Network Tab for CSS File Loading
- Click on the "Network" tab in the developer tools panel.
- Reload the page (`F5` or `Ctrl+R`).
- In the filtered list of resources loaded, look for `style.css`.
- Verify the status column for the CSS file:
    - Status `200` or `304` means the CSS loaded successfully.
    - Status `404` or any error code indicates the file was not loaded.

## Step 3: Check Console Tab for Errors
- Click on the "Console" tab in the developer tools panel.
- Look for any error messages or warnings, especially those related to CSS or missing files.
- Note any errors about resource loading or syntax that might cause styles to not apply.

## Step 4: Verify the Hamburger Button in the DOM
- Click on the "Elements" tab (or "Inspector").
- Use the element selector icon (top-left corner of dev tools panel) to hover over the hamburger menu area.
- Check if the `<button id="menuBtn">` and its child `<div class="hamburger-icon">` exist in the HTML.
- If the element exists but is invisible, CSS might be hiding it or styles might be broken.

## Step 5: Report Anything Unusual
- If you find CSS file not loaded or errors in the console, report them.
- If the hamburger button element is missing or hidden, note that as well.

---

Please perform these checks and share your findings. I will assist you with the next steps based on your results.
