document.addEventListener('DOMContentLoaded', () => {
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
  const footerHomeButton = document.getElementById('footer-home-button');
  const scrollToTopButton = document.getElementById('scroll-to-top');

  const COPY_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;
  const CHECK_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;

  let allFilesForCurrentFolder = [];
  let currentFolderPath = '';

  const FOLDERS = [
    { name: 'Certificates', path: 'public/certificates' },
    { name: 'Resume', path: 'public/Resume' },
    { name: 'Random', path: 'public/Random' }
  ];

  // Function to parse date string "dd-mm-yyyy" to a comparable timestamp
  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('-');
    return new Date(`${year}-${month}-${day}`).getTime();
  };

  const renderFolders = () => {
    foldersGrid.innerHTML = '';
    FOLDERS.forEach(folder => {
      const folderItem = document.createElement('div');
      folderItem.className = 'folder-item';
      folderItem.dataset.path = folder.path;
      folderItem.dataset.name = folder.name;
      folderItem.innerHTML = `
        <svg class="folder-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
          <path d="M10 4H4c-1.11 0-2 .89-2 2v12a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V8c0-1.11-.9-2-2-2h-8l-2-2z"/>
        </svg>
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
      updateAndRenderFiles();
    } catch (error) {
      console.error("Failed to load folder metadata:", error);
      alert("Could not load folder contents.");
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
      const preview = file.preview_image ? `${currentFolderPath}/${file.preview_image}` : '';
      const fileUrl = new URL(`${currentFolderPath}/${file.filename}`, window.location.href).href;

      fileItem.innerHTML = `
        <img src="${preview}" alt="${file.caption}" class="file-item-preview" onerror="this.style.display='none'">
        <div class="file-item-content">
          <h3 class="file-item-caption">${file.caption}</h3>
          <a href="${currentFolderPath}/${file.filename}" target="_blank">View / Download</a>
          <div class="file-item-tags">${tagsHTML}</div>
          <div class="file-item-meta">
             <span class="copy-link-btn" data-link="${fileUrl}" title="Copy file link">
                ${COPY_ICON_SVG}
             </span>
             <span class="file-date">Updated: ${file.updated}</span>
          </div>
        </div>
      `;
      filesGrid.appendChild(fileItem);
    });
  };

  const updateAndRenderFiles = () => {
    let processed = [...allFilesForCurrentFolder]; // Create a shallow copy to prevent mutating the original array

    // Default sort by date (latest first)
    processed.sort((a, b) => parseDate(b.updated) - parseDate(a.updated));

    const query = searchInput.value.toLowerCase().trim();
    const sortValue = sortSelect.value;

    if (query) {
      processed = processed.filter(file => {
        return (
          file.caption.toLowerCase().includes(query) ||
          file.tags.some(tag => tag.toLowerCase().includes(query))
        );
      });
    }

    // Apply additional sorting based on sortSelect if changed
    if (sortValue !== 'date-desc') {
      processed.sort((a, b) => {
        switch (sortValue) {
          case 'date-asc':
            return parseDate(a.updated) - parseDate(b.updated);
          case 'name-asc':
            return a.caption.localeCompare(b.caption);
          case 'name-desc':
            return b.caption.localeCompare(a.caption);
          default:
            return 0; // No change if default
        }
      });
    }

    renderFiles(processed);
  };

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
    searchInput.value = '';
    sortSelect.value = 'date-desc';
  };

  foldersGrid.addEventListener('click', e => {
    const folderItem = e.target.closest('.folder-item');
    if (folderItem) {
      loadAndDisplayFolder(folderItem.dataset.path, folderItem.dataset.name);
    }
  });

  backButton.addEventListener('click', switchToFoldersView);
  searchInput.addEventListener('input', updateAndRenderFiles);
  sortSelect.addEventListener('change', updateAndRenderFiles);
  footerHomeButton.addEventListener('click', switchToFoldersView);

  filesGrid.addEventListener('click', e => {
    // Handle tag clicks
    const tag = e.target.closest('.tag');
    if (tag) {
      searchInput.value = tag.textContent;
      updateAndRenderFiles();
      return;
    }
    
    // Handle copy link clicks
    const copyBtn = e.target.closest('.copy-link-btn');
    if (copyBtn) {
        const linkToCopy = copyBtn.dataset.link;
        navigator.clipboard.writeText(linkToCopy).then(() => {
            // Success feedback
            copyBtn.innerHTML = CHECK_ICON_SVG;
            setTimeout(() => {
                copyBtn.innerHTML = COPY_ICON_SVG;
            }, 2000); // Revert back after 2 seconds
        }).catch(err => {
            console.error('Failed to copy link: ', err);
            alert('Failed to copy link.'); // Fallback for user
        });
    }
  });

  // Scroll-to-top button logic
  window.addEventListener('scroll', () => {
    if (window.scrollY > 300) {
      scrollToTopButton.classList.add('visible');
    } else {
      scrollToTopButton.classList.remove('visible');
    }
  });

  scrollToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });

  renderFolders();
});