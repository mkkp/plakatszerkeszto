#!/bin/bash

# MKKP Plakátszerkesztő Development Server Script
# This script provides easy commands for development and testing

set -e  # Exit on any error

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Function to check if Node.js is installed
check_nodejs() {
    if ! command -v node &> /dev/null; then
        print_error "Node.js is not installed. Please install Node.js 20+ from https://nodejs.org/"
        exit 1
    fi
    
    NODE_VERSION=$(node -v | cut -d'v' -f2)
    MAJOR_VERSION=$(echo $NODE_VERSION | cut -d'.' -f1)
    
    if [ "$MAJOR_VERSION" -lt 20 ]; then
        print_warning "Node.js version $NODE_VERSION detected. Version 20+ is recommended."
    else
        print_status "Node.js version $NODE_VERSION detected"
    fi
}

# Function to install dependencies if needed
install_dependencies() {
    if [ ! -d "node_modules" ]; then
        print_status "Installing dependencies..."
        npm install
        print_success "Dependencies installed successfully"
    else
        print_status "Dependencies already installed"
    fi
}

# Function to start development server
development_mode() {
    print_status "Starting development server..."
    print_status "The application will be available at: http://localhost:8080"
    print_status "Press Ctrl+C to stop the server"
    echo
    npm start
}

# Function to build and serve production build
production_mode() {
    print_status "Building production version..."
    npm run build
    print_success "Production build completed"
    
    # Check if Python is available for simple HTTP server
    if command -v python3 &> /dev/null; then
        print_status "Starting production server with Python 3..."
        print_status "The application will be available at: http://localhost:8000"
        print_status "Press Ctrl+C to stop the server"
        echo
        cd dist && python3 -m http.server 8000
    elif command -v python &> /dev/null; then
        print_status "Starting production server with Python 2..."
        print_status "The application will be available at: http://localhost:8000"
        print_status "Press Ctrl+C to stop the server"
        echo
        cd dist && python -m SimpleHTTPServer 8000
    else
        print_error "Python is not available for serving static files"
        print_status "You can manually serve the files from the 'dist' directory"
        exit 1
    fi
}

# Function to clean build artifacts
clean_build() {
    print_status "Cleaning build artifacts..."
    if [ -d "dist" ]; then
        rm -rf dist
        print_success "Build artifacts cleaned"
    else
        print_status "No build artifacts to clean"
    fi
}

# Function to show usage
show_usage() {
    echo "Usage: $0 [OPTION]"
    echo ""
    echo "Options:"
    echo "  dev, development    Start development server (default)"
    echo "  prod, production    Build and serve production version"
    echo "  build               Build production version without serving"
    echo "  clean               Clean build artifacts"
    echo "  help                Show this help message"
    echo ""
    echo "Examples:"
    echo "  $0 dev              # Start development server"
    echo "  $0 production       # Build and serve production version"
    echo "  $0 build            # Just build production version"
    echo "  $0 clean            # Clean build directory"
}

# Main script logic
main() {
    # Default to development mode if no argument provided
    MODE=${1:-"dev"}
    
    # Check prerequisites
    check_nodejs
    
    # Install dependencies if needed
    install_dependencies
    
    case $MODE in
        "dev"|"development")
            development_mode
            ;;
        "prod"|"production")
            production_mode
            ;;
        "build")
            print_status "Building production version..."
            npm run build
            print_success "Production build completed in 'dist' directory"
            ;;
        "clean")
            clean_build
            ;;
        "help"|"-h"|"--help")
            show_usage
            ;;
        *)
            print_error "Unknown option: $MODE"
            show_usage
            exit 1
            ;;
    esac
}

# Run main function with all arguments
main "$@"