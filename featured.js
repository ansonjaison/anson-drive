document.addEventListener('DOMContentLoaded', () => {
  const searchInput = document.getElementById('search-input');
  const sortSelect = document.getElementById('sort-select');
  const filesGrid = document.getElementById('files-grid');
  const noResultsMessage = document.getElementById('no-results-message');
  const loadingMessage = document.getElementById('loading-message');
  const scrollToTopButton = document.getElementById('scroll-to-top');

  const COPY_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M16 1H4c-1.1 0-2 .9-2 2v14h2V3h12V1zm3 4H8c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h11c1.1 0 2-.9 2-2V7c0-1.1-.9-2-2-2zm0 16H8V7h11v14z"/></svg>`;
  const CHECK_ICON_SVG = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>`;
  
  let allFeaturedFiles = [];
  const metadataCache = new Map();

  const parseDate = (dateStr) => {
    const [day, month, year] = dateStr.split('-');
    return new Date(`${year}-${month}-${day}`).getTime();
  };

  const fetchMetadata = async (folderPath) => {
    if (metadataCache.has(folderPath)) {
      return metadataCache.get(folderPath);
    }
    try {
      const response = await fetch(`${folderPath}/metadata.json`);
      if (!response.ok) throw new Error(`Failed to load metadata for ${folderPath}`);
      const data = await response.json();
      metadataCache.set(folderPath, data);
      return data;
    } catch (error) {
      console.error(error);
      return null;
    }
  };

  const loadFeaturedFiles = async () => {
    try {
      const response = await fetch('featured.json');
      if (!response.ok) throw new Error('Could not find featured.json');
      const featuredPaths = await response.json();

      const filePromises = featuredPaths.map(async (fullPath) => {
        const lastSlashIndex = fullPath.lastIndexOf('/');
        const folderPath = fullPath.substring(0, lastSlashIndex);
        const filename = fullPath.substring(lastSlashIndex + 1);

        const metadata = await fetchMetadata(folderPath);
        if (!metadata) return null;

        const fileData = metadata.find(f => f.filename === filename);
        if (fileData) {
          return { ...fileData, folderPath }; // Add folderPath for link construction
        }
        return null;
      });

      const results = await Promise.all(filePromises);
      allFeaturedFiles = results.filter(Boolean); // Filter out any nulls
      updateAndRenderFiles();

    } catch (error) {
      console.error("Failed to load featured files:", error);
      filesGrid.innerHTML = `<p style="text-align: center; color: var(--secondary-text-color);">Error: Could not load featured files. Please check that featured.json exists and is correctly formatted.</p>`;
    } finally {
        loadingMessage.classList.add('hidden');
    }
  };

  const renderFiles = (filesToRender) => {
    filesGrid.innerHTML = '';
    noResultsMessage.classList.toggle('hidden', filesToRender.length > 0);

    filesToRender.forEach(file => {
      const fileItem = document.createElement('div');
      fileItem.className = 'file-item';

      const tagsHTML = file.tags.map(tag => `<span class="tag">${tag}</span>`).join('');
      const fileUrl = new URL(`${file.folderPath}/${file.filename}`, window.location.href).href;

      fileItem.innerHTML = `
        <div class="file-item-content">
          <h3 class="file-item-caption">${file.caption}</h3>
          <a href="${file.folderPath}/${file.filename}" target="_blank">View / Download</a>
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
    let processed = [...allFeaturedFiles];
    const query = searchInput.value.toLowerCase().trim();
    const sortValue = sortSelect.value;

    if (query) {
      processed = processed.filter(file => 
        file.caption.toLowerCase().includes(query) || 
        file.tags.some(tag => tag.toLowerCase().includes(query))
      );
    }

    // Only sort if a specific sort order is chosen (not 'default')
    if (sortValue !== 'default') {
      processed.sort((a, b) => {
        switch (sortValue) {
          case 'date-asc': return parseDate(a.updated) - parseDate(b.updated);
          case 'name-asc': return a.caption.localeCompare(b.caption);
          case 'name-desc': return b.caption.localeCompare(a.caption);
          case 'date-desc':
          default:
            return parseDate(b.updated) - parseDate(a.updated);
        }
      });
    }

    renderFiles(processed);
  };

  searchInput.addEventListener('input', updateAndRenderFiles);
  sortSelect.addEventListener('change', updateAndRenderFiles);

  filesGrid.addEventListener('click', e => {
    const copyBtn = e.target.closest('.copy-link-btn');
    if (copyBtn) {
      navigator.clipboard.writeText(copyBtn.dataset.link).then(() => {
        copyBtn.innerHTML = CHECK_ICON_SVG;
        setTimeout(() => { copyBtn.innerHTML = COPY_ICON_SVG; }, 2000);
      }).catch(err => {
        console.error('Failed to copy link: ', err);
        alert('Failed to copy link.');
      });
    }
  });

  window.addEventListener('scroll', () => {
    scrollToTopButton.classList.toggle('visible', window.scrollY > 300);
  });

  scrollToTopButton.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  loadFeaturedFiles();
});