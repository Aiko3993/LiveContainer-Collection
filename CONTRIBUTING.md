# How to Submit New Apps

Want to add an app to this source? There are two ways to do it.

### Method 1: The Easy Way (Recommended)

You don't need to edit any files. Just fill out a simple form!

1.  Go to the **[Issues](../../issues/new/choose)** tab.
2.  Click **"Get started"** next to **Add App Issue**.
3.  Fill in the **App Name**, **GitHub Repository** (e.g., `Owner/Repo`), and select the **Category**.
4.  Click **Submit new issue**.

Once an admin approves your request, the system will **automatically** add the app for you! 🎉

---

### Method 2: The Advanced Way (Pull Request)

If you prefer editing files directly or want to add multiple apps at once:

### Step 1: Choose Your Category

First, decide where your app belongs. **Do not mix categories.**

- **Standard Apps** (Normal apps): Go to [`sources/standard/apps.json`](sources/standard/apps.json)
- **NSFW Apps** (Adult content): Go to [`sources/nsfw/apps.json`](sources/nsfw/apps.json)

Click on the file link above to open it.

---

### Step 2: Edit the File

1.  Look for the **pencil icon** (✏️) in the top right corner of the file view to start editing.
2.  Scroll to the bottom of the list.
3.  Copy the code block below and paste it **before the last `]` bracket**.
4.  **Important**: Make sure to check if the previous item's closing brace `}` is followed by a comma `,`. Missing a comma will make the JSON invalid.

**Copy this template:**

```json
    ,
    {
        "name": "App Name Here",
        "github_repo": "DeveloperName/RepoName",
        "icon_url": "https://example.com/icon.png"
    }
```

#### Field Guide (Strictly Enforced)

*   **`name`** (Required): The display name of the app. Please use **English** or concise **Chinese**.
*   **`github_repo`** (Required): The GitHub repository (e.g., `Aiko3993/MyCoolApp`).
    *   ✅ **Recommended**: `Aiko3993/MyCoolApp`
    *   ✅ **Supported**: `https://github.com/Aiko3993/MyCoolApp` (System will auto-parse)
*   **`icon_url`** (Optional): A **direct link** to the app icon image.
    *   **Auto-Fetch**: If omitted, the system will automatically scan the repo for the best icon (prioritizing `AppIcon.appiconset`).
    *   If provided manually, it must start with `http://` or `https://`.

> ⚠️ **Warning**: Do not add `description`, `version`, or other fields not listed here. The system handles these automatically, and manually added fields will be **discarded**.

---

### Step 3: Submit for Review

1.  Scroll to the top right and click the green **"Commit changes..."** button.
2.  In the popup window, click **"Propose changes"**.
3.  On the next page, click **"Create pull request"**.

🎉 **Done!**
GitHub Actions will automatically validate your JSON format. If it passes, a maintainer will merge your submission shortly.
If it fails (Red ❌), please check if you missed a comma or used wrong quotes.

---

## For Maintainers

If you are a project maintainer or an AI assistant, please refer to the [Maintenance Manual](MAINTENANCE.md) for architecture details and operational guidelines.
