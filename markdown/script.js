// Load Markdown content from an external file
    async function loadContent() {
      try {
        const response = await fetch('content.md');
        if (!response.ok) throw new Error('Failed to load content');
        const markdownText = await response.text();
        return markdownText;
      } catch (error) {
        console.error('Error loading content:', error);
        return '# Error Loading Content\nThere was an issue loading the eBook content.';
      }
    }

    // Convert Markdown to HTML
    function markdownToHtml(markdown) {
      // Simple Markdown-to-HTML conversion (basic implementation)
      let html = markdown
        .replace(/^######\s+(.*)/gm, '<h6>$1</h6>') // h6
        .replace(/^#####\s+(.*)/gm, '<h5>$1</h5>') // h5
        .replace(/^####\s+(.*)/gm, '<h4>$1</h4>') // h4
        .replace(/^###\s+(.*)/gm, '<h3>$1</h3>') // h3
        .replace(/^##\s+(.*)/gm, '<h2>$1</h2>') // h2
        .replace(/^#\s+(.*)/gm, '<h1>$1</h1>') // h1
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>') // bold
        .replace(/\*(.*?)\*/g, '<em>$1</em>') // italic
        .replace(/`{3}([\s\S]*?)`{3}/gm, '<pre><code>$1</code></pre>') // code blocks
        .replace(/`([^`]*)`/g, '<code>$1</code>'); // inline code
      return html;
    }

    // Variables
    let currentPage = 1;
    const maxWordsPerPage = 300;
    let pages = [];

    // Split content into pages
    function splitContentIntoPages(html, wordsPerPage) {
      const tempDiv = document.createElement('div');
      tempDiv.innerHTML = html;
      const text = tempDiv.textContent || tempDiv.innerText || '';
      const words = text.split(' ');
      const totalPages = Math.ceil(words.length / wordsPerPage);

      const pageChunks = [];
      for (let i = 0; i < totalPages; i++) {
        const start = i * wordsPerPage;
        const end = start + wordsPerPage;
        pageChunks.push(words.slice(start, end).join(' '));
      }

      return pageChunks;
    }

    // Update displayed content
    function updateDisplayedContent() {
      document.getElementById('content-area').innerHTML = pages[currentPage - 1];
      document.getElementById('progress').textContent = `Page ${currentPage} of ${pages.length}`;
    }

    // Navigation Buttons
    document.getElementById('prev-btn').addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        updateDisplayedContent();
      }
    });

    document.getElementById('next-btn').addEventListener('click', () => {
      if (currentPage < pages.length) {
        currentPage++;
        updateDisplayedContent();
      }
    });

    // Dark Mode Toggle
    document.getElementById('settings-btn').addEventListener('click', () => {
      document.body.classList.toggle('dark-mode');
    });

    // Initialize Display
    async function initialize() {
      const markdown = await loadContent();
      const html = markdownToHtml(markdown);
      pages = splitContentIntoPages(html, maxWordsPerPage);
      updateDisplayedContent();
    }

    initialize();
