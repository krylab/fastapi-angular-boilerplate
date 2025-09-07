# GitHub Pages Deployment

This guide explains how to deploy the MkDocs documentation to GitHub Pages using GitHub Actions for automatic deployment.

## Overview

The documentation is automatically deployed to GitHub Pages using a GitHub Actions workflow that:

-   ✅ Triggers on pushes to the `main` branch
-   ✅ Builds the documentation with MkDocs
-   ✅ Deploys to GitHub Pages
-   ✅ Supports pull request previews
-   ✅ Uses the latest GitHub Pages deployment actions

## Setup Instructions

### 1. Repository Configuration

First, ensure your repository is configured for GitHub Pages:

1. **Go to your repository on GitHub**
2. **Navigate to Settings > Pages**
3. **Under "Source", select "GitHub Actions"**
4. **Save the settings**

### 2. Update Repository URLs

Update the URLs in `mkdocs.yml` to match your repository:

```yaml
site_url: https://your-username.github.io/fastapi-angular-boilerplate
repo_url: https://github.com/your-username/fastapi-angular-boilerplate
repo_name: fastapi-angular-boilerplate
```

Replace `your-username` with your actual GitHub username.

### 3. Workflow Configuration

The workflow is already configured in `.github/workflows/docs.yml`. It includes:

#### Trigger Conditions

```yaml
on:
    push:
        branches:
            - main
        paths:
            - "docs/**"
            - "mkdocs.yml"
            - "pyproject.toml"
            - ".github/workflows/docs.yml"
    pull_request:
        branches:
            - main
        paths:
            - "docs/**"
            - "mkdocs.yml"
            - "pyproject.toml"
            - ".github/workflows/docs.yml"
    workflow_dispatch: # Manual trigger
```

#### Permissions

```yaml
permissions:
    contents: read
    pages: write
    id-token: write
```

#### Jobs

1. **Build Job**: Installs dependencies, builds documentation
2. **Deploy Job**: Deploys to GitHub Pages (main branch only)
3. **Check Job**: Validates build for pull requests

### 4. Deployment Process

#### Automatic Deployment

The documentation deploys automatically when:

1. **Changes are pushed to `main` branch**
2. **Changes affect documentation files**:
    - `docs/**` - Documentation content
    - `mkdocs.yml` - MkDocs configuration
    - `pyproject.toml` - Dependencies
    - `.github/workflows/docs.yml` - Workflow file

#### Manual Deployment

You can trigger deployment manually:

1. **Via GitHub UI**:

    - Go to Actions tab
    - Select "Deploy Documentation" workflow
    - Click "Run workflow"

2. **Via Command Line**:

    ```bash
    # Using the docs script
    ./scripts/docs.sh deploy

    # Or directly with MkDocs
    uv run mkdocs gh-deploy --force
    ```

## Workflow Details

### Build Process

The workflow performs these steps:

```yaml
- name: Checkout
  uses: actions/checkout@v4
  with:
      fetch-depth: 0 # Full history for git info

- name: Setup Python
  uses: actions/setup-python@v5
  with:
      python-version: "3.12"

- name: Install UV
  uses: astral-sh/setup-uv@v3

- name: Install dependencies
  run: uv sync --group docs

- name: Build documentation
  run: uv run mkdocs build --strict --site-dir site
```

### Deployment Process

```yaml
- name: Deploy to GitHub Pages
  uses: actions/deploy-pages@v4
```

## Features

### 🚀 Automatic Deployment

-   **Push to main** → Automatic deployment
-   **No manual intervention** required
-   **Fast deployment** using GitHub Actions

### 🔍 Pull Request Previews

-   **Build verification** for PRs
-   **No deployment** for PRs (safety)
-   **Status checks** to prevent broken builds

### 📝 Edit Links

Direct edit links in the documentation:

```yaml
edit_uri: edit/main/docs/
```

Enables "Edit this page" buttons in the documentation.

### 🌐 Custom Domain Support

To use a custom domain:

1. **Add CNAME file** to `docs/` directory:

    ```
    echo "docs.yourdomain.com" > docs/CNAME
    ```

2. **Update site_url** in `mkdocs.yml`:

    ```yaml
    site_url: https://docs.yourdomain.com
    ```

3. **Configure DNS** to point to GitHub Pages

## Monitoring Deployment

### GitHub Actions

Monitor deployment status:

1. **Go to Actions tab** in your repository
2. **Check workflow runs** for "Deploy Documentation"
3. **View logs** for any issues

### GitHub Pages Settings

Check deployment status:

1. **Go to Settings > Pages**
2. **View deployment history**
3. **Check custom domain** configuration

### Site Health

Verify the deployed site:

```bash
# Check if site is accessible
curl -I https://your-username.github.io/fastapi-angular-boilerplate

# Check specific pages
curl -I https://your-username.github.io/fastapi-angular-boilerplate/getting-started/installation/
```

## Troubleshooting

### Common Issues

#### 1. Build Failures

**Problem**: Documentation fails to build

**Solutions**:

```bash
# Test build locally
uv run mkdocs build --strict

# Check for broken links
uv run mkdocs build --strict --verbose

# Validate configuration
uv run mkdocs config
```

#### 2. Permission Errors

**Problem**: Workflow lacks permissions

**Solution**: Ensure repository settings allow GitHub Actions to deploy to Pages:

1. **Settings > Actions > General**
2. **Workflow permissions > Read and write permissions**
3. **Save settings**

#### 3. Custom Domain Issues

**Problem**: Custom domain not working

**Solutions**:

1. **Check CNAME file** exists in `docs/` directory
2. **Verify DNS configuration**
3. **Check GitHub Pages settings**
4. **Wait for DNS propagation** (up to 24 hours)

#### 4. Outdated Dependencies

**Problem**: Build fails due to outdated packages

**Solution**:

```bash
# Update dependencies locally
uv sync --group docs --upgrade

# Commit updated uv.lock
git add uv.lock
git commit -m "Update documentation dependencies"
```

### Debug Mode

Enable debug logging in the workflow:

```yaml
- name: Build documentation
  run: uv run mkdocs build --strict --verbose --site-dir site
  env:
      MKDOCS_DEBUG: 1
```

## Security Considerations

### Permissions

The workflow uses minimal required permissions:

```yaml
permissions:
    contents: read # Read repository content
    pages: write # Deploy to GitHub Pages
    id-token: write # OIDC token for deployment
```

### Branch Protection

Consider protecting the `main` branch:

1. **Settings > Branches**
2. **Add branch protection rule** for `main`
3. **Require status checks** including documentation build
4. **Require pull request reviews**

### Secrets

No secrets are required for basic GitHub Pages deployment. For custom integrations:

1. **Use repository secrets** for sensitive data
2. **Reference in workflow** with `${{ secrets.SECRET_NAME }}`
3. **Never commit secrets** to the repository

## Advanced Configuration

### Multiple Environments

Deploy to different environments:

```yaml
# Production (main branch)
- name: Deploy to Production
  if: github.ref == 'refs/heads/main'
  run: uv run mkdocs gh-deploy --force

# Staging (develop branch)
- name: Deploy to Staging
  if: github.ref == 'refs/heads/develop'
  run: uv run mkdocs gh-deploy --force --remote-branch gh-pages-staging
```

### Conditional Deployment

Deploy only when documentation changes:

```yaml
- name: Check for documentation changes
  uses: dorny/paths-filter@v2
  id: changes
  with:
      filters: |
          docs:
            - 'docs/**'
            - 'mkdocs.yml'

- name: Deploy documentation
  if: steps.changes.outputs.docs == 'true'
  run: uv run mkdocs gh-deploy --force
```

### Performance Optimization

Cache dependencies for faster builds:

```yaml
- name: Cache UV dependencies
  uses: actions/cache@v3
  with:
      path: ~/.cache/uv
      key: ${{ runner.os }}-uv-${{ hashFiles('**/uv.lock') }}
      restore-keys: |
          ${{ runner.os }}-uv-
```

## Next Steps

1. **Push changes** to `main` branch to trigger first deployment
2. **Check GitHub Pages** settings are configured
3. **Verify deployment** at your GitHub Pages URL
4. **Set up custom domain** if needed
5. **Configure branch protection** for production safety

## Resources

-   [GitHub Pages Documentation](https://docs.github.com/en/pages)
-   [GitHub Actions Documentation](https://docs.github.com/en/actions)
-   [MkDocs Deployment Guide](https://www.mkdocs.org/user-guide/deploying-your-docs/)
-   [Material for MkDocs Deployment](https://squidfunk.github.io/mkdocs-material/publishing-your-site/)
