# Deployment Guide for GitHub Pages

This guide will help you deploy your Java Study Tracker to GitHub Pages.

## Prerequisites

- A GitHub account
- Git installed on your computer
- Your project files ready

## Step-by-Step Deployment

### 1. Create a New Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon in the top right corner
3. Select "New repository"
4. Name your repository (e.g., `java-study-tracker`)
5. Make sure it's set to "Public" (required for free GitHub Pages)
6. Don't initialize with README (we already have one)
7. Click "Create repository"

### 2. Upload Your Files

#### Option A: Using Git Command Line

```bash
# Initialize git in your project folder
cd "/path/to/your/Java-Book-Progress"
git init

# Add all files
git add .

# Commit files
git commit -m "Initial commit: Java Study Tracker"

# Add your GitHub repository as origin
git remote add origin https://github.com/yourusername/java-study-tracker.git

# Push to GitHub
git push -u origin main
```

#### Option B: Using GitHub Web Interface

1. Click "uploading an existing file" on your new repository page
2. Drag and drop all your project files:
   - `index.html`
   - `app.js`
   - `styles.css`
   - `data.js`
   - `README.md`
   - `.gitignore`
3. Add a commit message like "Initial commit: Java Study Tracker"
4. Click "Commit changes"

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click on "Settings" tab
3. Scroll down to "Pages" in the left sidebar
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"

### 4. Access Your Live Site

- GitHub will provide you with a URL like: `https://yourusername.github.io/java-study-tracker`
- It may take a few minutes for the site to be available
- You'll see a green checkmark when deployment is successful

## Custom Domain (Optional)

If you want to use a custom domain:

1. Add a `CNAME` file to your repository root with your domain name
2. Configure your domain's DNS to point to GitHub Pages
3. Update the custom domain setting in repository settings

## Updating Your Site

Whenever you make changes:

1. Update your files locally
2. Commit and push changes to GitHub:

   ```bash
   git add .
   git commit -m "Update: describe your changes"
   git push
   ```

3. GitHub Pages will automatically redeploy your site

## Troubleshooting

### Site Not Loading

- Check that GitHub Pages is enabled in settings
- Ensure your main file is named `index.html`
- Wait a few minutes for deployment to complete

### Changes Not Showing

- Hard refresh your browser (Ctrl+F5 or Cmd+Shift+R)
- Check that your changes were successfully pushed to GitHub
- GitHub Pages updates may take a few minutes

### 404 Error

- Verify your repository is public
- Check that `index.html` exists in the root directory
- Ensure GitHub Pages is enabled and configured correctly

## Security Note

Since this is a static site with local storage:

- No server-side code or databases are involved
- All user data stays in their browser
- No sensitive information is transmitted
- The site is secure for public hosting

## Success! 🎉

Your Java Study Tracker is now live and accessible to anyone with the URL. Share it with fellow Java learners!

---

For support, check the [repository issues](https://github.com/yourusername/java-study-tracker/issues) or create a new issue.
