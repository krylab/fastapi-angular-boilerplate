#!/bin/bash

# Documentation management script

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"

cd "$PROJECT_ROOT"

case "${1:-help}" in
    "install")
        echo "Installing documentation dependencies..."
        uv sync --group docs
        echo "✅ Documentation dependencies installed"
        ;;
    
    "build")
        echo "Building documentation..."
        uv run mkdocs build
        echo "✅ Documentation built successfully"
        echo "📁 Output: site/"
        ;;
    
    "serve")
        echo "Starting documentation server..."
        echo "📖 Documentation will be available at: http://localhost:8001"
        uv run mkdocs serve --dev-addr 0.0.0.0:8001
        ;;
    
    "deploy")
        echo "Deploying documentation to GitHub Pages..."
        echo "⚠️  Note: Automatic deployment is configured via GitHub Actions"
        echo "🔗 Push to main branch to trigger automatic deployment"
        echo ""
        echo "For manual deployment (if needed):"
        echo "  uv run mkdocs gh-deploy --force"
        echo ""
        read -p "Deploy manually now? (y/N): " -n 1 -r
        echo
        if [[ $REPLY =~ ^[Yy]$ ]]; then
            uv run mkdocs gh-deploy --force
            echo "✅ Documentation deployed manually"
        else
            echo "ℹ️  Manual deployment cancelled"
        fi
        ;;
    
    "clean")
        echo "Cleaning documentation build..."
        rm -rf site/
        echo "✅ Documentation build cleaned"
        ;;
    
    "help"|*)
        echo "Documentation management script"
        echo ""
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  install    Install documentation dependencies"
        echo "  build      Build the documentation"
        echo "  serve      Start the development server"
        echo "  deploy     Deploy to GitHub Pages"
        echo "  clean      Clean the build directory"
        echo "  help       Show this help message"
        echo ""
        echo "Examples:"
        echo "  $0 install    # Install dependencies"
        echo "  $0 serve      # Start development server"
        echo "  $0 build      # Build for production"
        ;;
esac
