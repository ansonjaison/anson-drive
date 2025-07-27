# Anson’s Drive 📂

<img width="1919" height="971" alt="Anson's Drive Preview" src="https://anson-drive.pages.dev/public/Images/Anson's%20Drive%20Preview.png" />

**Anson’s Drive** is a sleek, modern web application designed to showcase a curated collection of professional documents, such as certificates and resumes, in an organized, user-friendly interface. Hosted on **Cloudflare Pages** (accessible at [https://anson-drive.pages.dev/](https://anson-drive.pages.dev/)), this project was planned with assistance from **ChatGPT**, and coded with the help of **Gemini** and **Grok**. It features a responsive design, intuitive navigation, and a robust metadata management system for organizing and displaying files. The application supports folder browsing, file searching, sorting, and metadata generation for easy document management. 🚀

This README provides a comprehensive overview of the project, its features, setup instructions, technical details, and contribution guidelines. 📖

---

## Features ✨

- **Responsive Design**: Adapts seamlessly to various screen sizes, from mobile devices to desktops, ensuring a consistent user experience. 📱💻
- **Folder Navigation**: Browse through predefined folders (Certificates, Resume, Random) with a clean grid layout. 📁
- **File Display**: View files with preview images, captions, tags, and updated dates, along with options to view/download or copy file links. 📜
- **Search Functionality**: Filter files by captions or tags using a real-time search input. 🔎
- **Sorting Options**: Sort files by newest/oldest date or alphabetically (A-Z/Z-A). 📅
- **Metadata Generator**: An admin page (`admin.html`) to create and manage `metadata.json` files for each folder. 🛠️
- **Copy Link Feature**: Copy file URLs to the clipboard with visual feedback (copy to checkmark transition). 📋
- **Scroll-to-Top Button**: Smoothly scroll back to the top of the page when needed. ⬆️
- **Dark Theme**: A modern dark-themed UI with customizable CSS variables for easy theming. 🌙
- **Cloudflare Pages Hosting**: Fast, secure, and scalable deployment with automatic HTTPS. ☁️
- **Featured Files Section**: A dedicated page (`featured.html`) to highlight specific files from various folders, enhancing visibility of key documents. ⭐

---

## Demo 🌐

Visit the live demo at [https://anson-drive.pages.dev/](https://anson-drive.pages.dev/) to explore the application. You can browse folders, search for files, use the admin page to generate metadata, and check out the new featured files section. 🚀

---

## Project Structure 🗂️

The project is organized as follows:

```
anson-drive/
├── public/
│   ├── certificates/
│   │   ├── metadata.json
│   │   └── [certificate files]
│   ├── Resume/
│   │   ├── metadata.json
│   │   └── [Resume files]
│   ├── Random/
│   │   ├── metadata.json
│   │   └── [Random files]
│   ├── Images/
│   │   └── [Preview images for meta open graphs]
├── index.html
├── admin.html
├── featured.html
├── script.js
├── featured.js
├── style.css
├── README.md
```

- **`public/`**: Contains folders for Certificates, Resume, and Random, each with a `metadata.json` file and associated files/preview images. 📁
- **`public/Images/`**: Stores preview images used for meta open graphs to enhance social media sharing and SEO. 🖼️
- **`index.html`**: The main page for browsing folders and files. 🏠
- **`admin.html`**: A utility page for generating `metadata.json` files. 🛠️
- **`featured.html`**: A page to showcase featured files with search and sort capabilities, linked from the main index. ⭐
- **`script.js`**: Handles all frontend logic, including folder/file rendering, search, sorting, and copy functionality. ⚙️
- **`featured.js`**: Manages the featured files page logic, including file loading and display from `featured.json`. ⚙️
- **`style.css`**: Defines the dark-themed, responsive UI with CSS variables. 🎨
- **`README.md`**: This file, documenting the project. 📖

---

## Technologies Used 🛠️

- **HTML5**: Structure for the web pages. 🏗️
- **CSS3**: Styling with a dark theme, CSS Grid, and custom properties (`--variables`). 🎨
- **JavaScript (ES6+)**: Frontend logic for dynamic rendering, event handling, and clipboard interactions. ⚙️
- **Cloudflare Pages**: Hosting platform for deployment. ☁️
- **SVG Icons**: Used for folder icons, copy/check buttons, and scroll-to-top. 🖼️
- **AI Tools**:
  - **ChatGPT**: Assisted in planning the project structure and features. 🧠
  - **Gemini**: Provided code snippets and debugging assistance. 🤖
  - **Grok**: Contributed to refining code and optimizing logic. 🌟

---

## How It Works ⚙️

### Frontend Interface 🖥️

The application is built as a single-page application (SPA) with two main views:

1. **Folders View** (`index.html`):
   - Displays a grid of folders (Certificates, Resume, Random) with SVG icons and names. 📁
   - Clicking a folder fetches its `metadata.json` and switches to the Files View. 🔄
   - A search bar and sort dropdown are hidden in this view. 🙈

2. **Files View** (`index.html`):
   - Shows a grid of files with preview images, captions, tags, updated dates, and action buttons (View/Download, Copy Link). 📜
   - Includes a search bar to filter files by caption or tags and a dropdown to sort files. 🔍
   - A "Back to Folders" button returns to the Folders View. 🔙

3. **Featured Files View** (`featured.html`):
   - Displays a curated list of featured files from `featured.json`, with search and sort options similar to the Files View. ⭐
   - Links back to the main index for full folder browsing. 🔙

### Metadata Management 📝

Each folder in the `public/` directory contains a `metadata.json` file with an array of file objects. The `admin.html` page provides a form to generate this JSON:

- **Inputs**: File selection, caption, comma-separated tags, and updated date. 📋
- **Output**: A JSON object displayed in a `<pre>` element, which can be copied and saved as `metadata.json` in the respective folder. 💾
- **Format**: See [File Metadata Format](#file-metadata-format) below.

### File Sorting and Filtering 🔍

- **Sorting**: Files are sorted by:
  - Newest First (default): Based on `updated` date (descending). 📅
  - Oldest First: Based on `updated` date (ascending). 📅
  - Name (A-Z): Alphabetical by caption. 🔤
  - Name (Z-A): Reverse alphabetical by caption. 🔤
- **Filtering**: The search input filters files by matching the query against captions and tags (case-insensitive). 🔎
- **Implementation**: JavaScript’s `filter` and `sort` methods process the file array dynamically on input or sort changes. ⚙️

### Copy Link Functionality 📋

- Each file has a "Copy Link" button that copies its URL to the clipboard using `navigator.clipboard.writeText`. 🔗
- Visual feedback: The button’s SVG icon changes from a copy icon to a checkmark for 2 seconds after a successful copy. ✅
- Error handling: Alerts the user if the copy operation fails. 🚫

### Scroll-to-Top Feature ⬆️

- A button appears when the user scrolls down more than 300 pixels. 👀
- Clicking it smoothly scrolls to the top of the page using `window.scrollTo` with `behavior: 'smooth'`. 🚀
- The button is styled with a circular design and hover effects. 🎨

---

## Setup Instructions 🏗️

### Prerequisites ✅

- **Git**: To clone the repository. 📥
- **Cloudflare Account**: For deployment to Cloudflare Pages. ☁️
- A modern web browser (Chrome, Firefox, Edge, etc.). 🌐

### Installation 📦

1. **Clone the Repository**:
   ```bash
   git clone https://github.com/ansonjaison/anson-drive.git
   cd anson-drive
   ```

2. **Prepare the `public/` Directory**:
   - Create folders (`certificates`, `Resume`, `Random`, `Images`) inside `public/`. 📁
   - Add files and preview images to each folder. 🖼️
   - Create a `metadata.json` file for each folder using `admin.html` or manually (see [File Metadata Format](#file-metadata-format)). 📝
   - Add a `featured.json` file in the root directory listing featured file paths (see example in `featured.json`). ⭐
   - Place preview images for meta open graphs in the `Images/` folder. 🖼️

### Running Locally 💻

1. **Using a Simple HTTP Server**:
   ```bash
   npm install -g http-server
   http-server .
   ```
   Access the app at `http://localhost:8080`. 🌐

2. Open `index.html` in a browser to view the Folders View, `featured.html` for featured files, or `admin.html` for metadata generation. 🖥️

### Deploying to Cloudflare Pages ☁️

1. **Push to GitHub**:
   - Push the project to the repository:
     ```bash
     git add .
     git commit -m "Initial commit"
     git push origin main
     ```

2. **Set Up Cloudflare Pages**:
   - Log in to [Cloudflare Pages](https://pages.cloudflare.com/). 🔐
   - Connect the GitHub repository: [https://github.com/ansonjaison/anson-drive](https://github.com/ansonjaison/anson-drive). 📥
   - Configure the build settings:
     - **Build command**: Not needed (static site). 🚫
     - **Output directory**: `/`. 📁
   - Deploy the site. The URL will be `anson-drive.pages.dev`. 🌐

3. **Custom Domain** (Optional):
   - In Cloudflare, add a custom domain and configure a `CNAME` record pointing to `anson-drive.pages.dev`. 🌍

---

## File Metadata Format 📄

Each folder in `public/` must contain a `metadata.json` file with the following structure:

```json
[
  {
    "filename": "example.pdf",
    "caption": "Example Certificate",
    "tags": ["certificate", "achievement"],
    "updated": "dd-mm-yyyy",
    "preview_image": "example-preview.jpg"
  },
  ...
]
```

- **`filename`**: The name of the file in the folder (e.g., `certificate.pdf`). 📜
- **`caption`**: A descriptive title for the file. 📝
- **`tags`**: An array of tags for filtering. 🏷️
- **`updated`**: The date in `dd-mm-yyyy` format. 📅
- **`preview_image`**: Optional preview image filename (e.g., `preview.jpg`). 🖼️

Use `admin.html` to generate this JSON by filling out the form and copying the output. 💾

---

## Contributing 🤝

Contributions are welcome! To contribute:

1. **Fork the Repository**:
   - Click "Fork" on [https://github.com/ansonjaison/anson-drive](https://github.com/ansonjaison/anson-drive). 🍴

2. **Create a Branch**:
   ```bash
   git checkout -b feature/your-feature
   ```

3. **Make Changes**:
   - Follow the coding style in `script.js`, `featured.js`, and `style.css`. 📝
   - Ensure responsiveness and test across browsers. 🖥️

4. **Test Locally**:
   - Verify functionality using a local server. ✅
   - Check `admin.html` for metadata generation and `featured.html` for featured file display. 🛠️

5. **Submit a Pull Request**:
   - Push your changes and create a PR with a clear description of the changes. 📬

Please adhere to the [Code of Conduct](CODE_OF_CONDUCT.md) (if present) and ensure all tests pass. 🙌

---

## Future Enhancements 🚀

- **Authentication**: Add user authentication to restrict access to `admin.html`. 🔐
- **Dynamic Folder Creation**: Allow users to create new folders via the UI. 📁
- **File Uploads**: Enable file uploads directly from the admin page. 📤
- **Advanced Search**: Support for regex or tag-based filtering. 🔍
- **Light Theme**: Add a toggle for light/dark mode. 🌞
- **Analytics**: Track page views and file downloads using Cloudflare Analytics. 📊
- **Accessibility**: Improve ARIA attributes and keyboard navigation. ♿

---

## License 📜

This project is licensed under the [MIT License](LICENSE). You are free to use, modify, and distribute the code, provided you include the license and copyright notice. ✅

---

## Acknowledgements 🙌

- **ChatGPT**: For helping plan the project structure and features. 🧠
- **Gemini**: For providing code snippets and debugging support. 🤖
- **Grok**: For refining code and optimizing logic. 🌟
- **Cloudflare Pages**: For fast and reliable hosting. ☁️
- **Inter Font**: For the clean, modern typography used in the UI. ✍️
- **SVG Icons**: From [SVGOMG](https://jakearchibald.github.io/svgomg/) for optimized icons. 🖼️

Thank you for exploring **Anson’s Drive**! If you have questions or feedback, feel free to open an issue or contact me via GitHub. 😊