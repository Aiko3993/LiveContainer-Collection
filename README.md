# Aiko3993's Sideload Source for iOS

[![Web Interface](https://img.shields.io/badge/Web_Interface-View_Source-blue?style=for-the-badge&logo=safari)](https://aiko3993.github.io/iOS-Sideload-Source/)
[![Add App](https://img.shields.io/badge/Contribute-Add_App-green?style=for-the-badge&logo=github)](CONTRIBUTING.md)

This is a sideload app source compatible with **AltStore**, **SideStore**, and **LiveContainer**, and maybe more.
It automatically fetches the latest IPAs from GitHub Releases and generates a universal source file.  
It also provides a web interface for browsing apps.

[中文文档](README_CN.md)

## Usage

### Method 1: Web Interface
Visit the **[Web Interface](https://aiko3993.github.io/iOS-Sideload-Source/)** to:
*   Browse the complete app catalog.
*   Use the **Install** buttons for AltStore/SideStore/LiveContainer.

### Method 2: Add Source Manually

Copy the link below into your preferred sideloading tool:

```
https://raw.githubusercontent.com/Aiko3993/iOS-Sideload-Source/main/sources/standard/source.json
```

## Contributing

Want to add a new app?
👉 **[Read the Contributing Guide](CONTRIBUTING.md)**

## Supported Apps

> *The supported app list is automatically generated.*

👉 **[View Supported Apps List](APPS.md)**

## Automation

This project runs on GitHub Actions:
*   **Hourly Updates**: Checks for new releases every hour.
*   **Smart Parsing**: Extracts metadata (Version, BundleID, TintColor) directly from the IPA.
*   **Auto Icon Discovery**: Automatically scans the repository for app icons if not provided.
*   **Validation**: Automatically checks `apps.json` syntax on Pull Requests.

## Additional Sources

**NSFW Source:**:

```
https://raw.githubusercontent.com/Aiko3993/iOS-Sideload-Source/main/sources/nsfw/source.json
```

## Disclaimer

This repository serves only as a mirror and index. All app copyrights belong to their original authors. Please assess the risks yourself before use.
