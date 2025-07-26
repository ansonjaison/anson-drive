document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const headerTitle = document.getElementById('header-title');
    const searchContainer = document.getElementById('search-container');
    const searchInput = document.getElementById('search-input');
    const sortSelect = document.getElementById('sort-select');
    const foldersView = document.getElementById('folders-view');
    const filesView = document.getElementById('files-view');
    const foldersGrid = document.getElementById('folders-grid');
    const filesGrid = document.getElementById('files-grid');
    const backButton = document.getElementById('back-button');
    const folderNameTitle = document.getElementById('folder-name-title');
    const noResultsMessage = document.getElementById('no-results-message');

    // --- State Management ---
    let allFilesForCurrentFolder = [];
    let currentFolderPath = '';

    // --- Configuration ---
    const FOLDERS = [
        { name: 'Certificates', path: 'public/certificates' },
        { name: 'Personal Docs', path: 'public/personal_docs' }
    ];

    /**
     * MOCK DATA NOTE:
     * Your metadata.json should now include a "preview_image" field.
     * Example for public/certificates/metadata.json:
     * [
     * {
     * "filename": "AWS-Cloud-Practitioner.pdf",
     * "caption": "AWS Cloud Practitioner",
     * "preview_image": "aws-preview.png",
     * "tags": ["cloud", "aws", "foundational"],
     * "updated": "2024-05-20"
     * }
     * ]
     */

    // --- Core Functions ---

    const renderFolders = () => {
        foldersGrid.innerHTML = '';
        FOLDERS.forEach(folder => {
            const folderItem = document.createElement('div');
            folderItem.className = 'folder-item';
            folderItem.dataset.path = folder.path;
            folderItem.dataset.name = folder.name;
            folderItem.innerHTML = `
                <svg class="folder-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M10 4H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8c0-1.11-.9-2-2-2h-8l-2-2z"/></svg>
                <span class="folder-item-name">${folder.name}</span>
            `;
            foldersGrid.appendChild(folderItem);
        });
    };

    const loadAndDisplayFolder = async (folderPath, folderName) => {
        try {
            const response = await fetch(`${folderPath}/metadata.json`);
            if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
            
            allFilesForCurrentFolder = await response.json();
            currentFolderPath = folderPath;
            
            switchToFilesView(folderName);
            updateAndRenderFiles(); // Initial render with default sort
        } catch (error) {
            console.error("Failed to load folder metadata:", error);
            alert("Could not load folder contents. Please check the console for errors.");
        }
    };

    const renderFiles = (filesToRender) => {
        filesGrid.innerHTML = '';
        noResultsMessage.classList.toggle('hidden', filesToRender.length > 0);

        if (filesToRender.length === 0) return;

        filesToRender.forEach(file => {
            const fileItem = document.createElement('div');
            fileItem.className = 'file-item';
            const tagsHTML = file.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
            const previewSrc = `${currentFolderPath}/${file.preview_image}`;

            fileItem.innerHTML = `
                <img src="${previewSrc}" alt="${file.caption} preview" class="file-item-preview" onerror="this.style.display='none'">
                <div class="file-item-content">
                    <h3 class="file-item-caption">${file.caption}</h3>
                    <a href="${currentFolderPath}/${file.filename}" target="_blank" rel="noopener noreferrer">View / Download</a>
                    <div class="file-item-tags">${tagsHTML}</div>
                    <div class="file-item-meta">
                        <span>Updated: ${file.updated}</span>
                    </div>
                </div>
            `;
            filesGrid.appendChild(fileItem);
        });
    };

    /**
     * Central function to filter, sort, and render the files.
     * This is called whenever the search or sort criteria change.
     */
    const updateAndRenderFiles = () => {
        const query = searchInput.value.toLowerCase().trim();
        const sortValue = sortSelect.value;

        // 1. Filter
        let processedFiles = allFilesForCurrentFolder;
        if (query) {
            processedFiles = allFilesForCurrentFolder.filter(file => {
                const captionMatch = file.caption.toLowerCase().includes(query);
                const tagMatch = file.tags.some(tag => tag.toLowerCase().includes(query));
                return captionMatch || tagMatch;
            });
        }

        // 2. Sort
        processedFiles.sort((a, b) => {
            switch (sortValue) {
                case 'date-asc':
                    return new Date(a.updated) - new Date(b.updated);
                case 'name-asc':
                    return a.caption.localeCompare(b.caption);
                case 'name-desc':
                    return b.caption.localeCompare(a.caption);
                case 'date-desc':
                default:
                    return new Date(b.updated) - new Date(a.updated);
            }
        });

        // 3. Render
        renderFiles(processedFiles);
    };

    // --- View Switching ---

    const switchToFilesView = (folderName) => {
        foldersView.classList.add('hidden');
        filesView.classList.remove('hidden');
        searchContainer.classList.remove('hidden');
        folderNameTitle.textContent = folderName;
        headerTitle.classList.add('hidden');
    };

    const switchToFoldersView = () => {
        filesView.classList.add('hidden');
        searchContainer.classList.add('hidden');
        foldersView.classList.remove('hidden');
        headerTitle.classList.remove('hidden');
        // Reset controls
        searchInput.value = '';
        sortSelect.value = 'date-desc';
    };

    // --- Event Listeners ---

    foldersGrid.addEventListener('click', e => {
        const folderItem = e.target.closest('.folder-item');
        if (folderItem) {
            loadAndDisplayFolder(folderItem.dataset.path, folderItem.dataset.name);
        }
    });

    backButton.addEventListener('click', switchToFoldersView);
    
    searchInput.addEventListener('input', updateAndRenderFiles);
    sortSelect.addEventListener('change', updateAndRenderFiles);

    filesGrid.addEventListener('click', e => {
        if (e.target.classList.contains('tag')) {
            searchInput.value = e.target.textContent;
            updateAndRenderFiles(); // Trigger filter and sort
        }
    });

    // --- Initial Load ---
    renderFolders();
});