class PDFReader {
    constructor() {
        this.pdfDoc = null;
        this.pageNum = 1;
        this.pageRendering = false;
        this.pageNumPending = null;
        this.scale = 1.0;
        this.canvas = document.getElementById('pdf-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this.initializeElements();
        this.initializeEventListeners();
    }

    initializeElements() {
        this.elements = {
            fileInput: document.getElementById('file-input'),
            prevPage: document.getElementById('prev-page'),
            nextPage: document.getElementById('next-page'),
            pageNum: document.getElementById('page-num'),
            pageCount: document.getElementById('page-count'),
            zoomLevel: document.getElementById('zoom-level'),
            zoomIn: document.getElementById('zoom-in'),
            zoomOut: document.getElementById('zoom-out'),
            fitWidth: document.getElementById('fit-width'),
            fitHeight: document.getElementById('fit-height'),
            loading: document.getElementById('loading'),
            error: document.getElementById('error'),
            viewerContainer: document.getElementById('viewer-container'),
            thumbnailContainer: document.getElementById('thumbnail-container')
        };
    }

    initializeEventListeners() {
        // File input
        this.elements.fileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (file && file.type === 'application/pdf') {
                this.loadPDF(file);
            }
        });

        // Page navigation
        this.elements.prevPage.addEventListener('click', () => {
            this.previousPage();
        });

        this.elements.nextPage.addEventListener('click', () => {
            this.nextPage();
        });

        this.elements.pageNum.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const pageNumber = parseInt(this.elements.pageNum.value);
                if (pageNumber > 0 && pageNumber <= this.pdfDoc.numPages) {
                    this.pageNum = pageNumber;
                    this.renderPage(pageNumber);
                }
            }
        });

        // Zoom controls
        this.elements.zoomIn.addEventListener('click', () => {
            this.zoomIn();
        });

        this.elements.zoomOut.addEventListener('click', () => {
            this.zoomOut();
        });

        this.elements.fitWidth.addEventListener('click', () => {
            this.fitToWidth();
        });

        this.elements.fitHeight.addEventListener('click', () => {
            this.fitToHeight();
        });

        // Keyboard shortcuts
        document.addEventListener('keydown', (e) => {
            if (this.pdfDoc) {
                switch(e.key) {
                    case 'ArrowLeft':
                        e.preventDefault();
                        this.previousPage();
                        break;
                    case 'ArrowRight':
                        e.preventDefault();
                        this.nextPage();
                        break;
                    case '+':
                        e.preventDefault();
                        this.zoomIn();
                        break;
                    case '-':
                        e.preventDefault();
                        this.zoomOut();
                        break;
                }
            }
        });
    }

    async loadPDF(file) {
        this.showLoading();
        this.hideError();

        try {
            const arrayBuffer = await file.arrayBuffer();
            const typedArray = new Uint8Array(arrayBuffer);
            
            this.pdfDoc = await pdfjsLib.getDocument(typedArray).promise;
            
            this.pageNum = 1;
            this.updatePageControls();
            await this.renderPage(this.pageNum);
            await this.generateThumbnails();
            
        } catch (error) {
            this.showError('Error loading PDF: ' + error.message);
            console.error('PDF loading error:', error);
        } finally {
            this.hideLoading();
        }
    }

    async renderPage(num) {
        if (this.pageRendering) {
            this.pageNumPending = num;
            return;
        }

        this.pageRendering = true;
        this.showLoading();

        try {
            const page = await this.pdfDoc.getPage(num);
            const viewport = page.getViewport({ scale: this.scale });

            this.canvas.height = viewport.height;
            this.canvas.width = viewport.width;

            const renderContext = {
                canvasContext: this.ctx,
                viewport: viewport
            };

            await page.render(renderContext).promise;
            
            this.pageNum = num;
            this.updatePageControls();
            this.updateActiveThumbnail();
            
        } catch (error) {
            this.showError('Error rendering page: ' + error.message);
            console.error('Page rendering error:', error);
        } finally {
            this.pageRendering = false;
            this.hideLoading();
            
            if (this.pageNumPending !== null) {
                this.renderPage(this.pageNumPending);
                this.pageNumPending = null;
            }
        }
    }

    async generateThumbnails() {
        this.elements.thumbnailContainer.innerHTML = '';
        
        for (let i = 1; i <= this.pdfDoc.numPages; i++) {
            const thumbnailDiv = document.createElement('div');
            thumbnailDiv.className = 'thumbnail';
            if (i === 1) thumbnailDiv.classList.add('active');
            
            const thumbnailCanvas = document.createElement('canvas');
            thumbnailDiv.appendChild(thumbnailCanvas);
            
            thumbnailDiv.addEventListener('click', () => {
                this.pageNum = i;
                this.renderPage(i);
            });
            
            this.elements.thumbnailContainer.appendChild(thumbnailDiv);
            
            // Render thumbnail
            try {
                const page = await this.pdfDoc.getPage(i);
                const viewport = page.getViewport({ scale: 0.2 }); // Small scale for thumbnails
                
                thumbnailCanvas.height = viewport.height;
                thumbnailCanvas.width = viewport.width;
                
                const renderContext = {
                    canvasContext: thumbnailCanvas.getContext('2d'),
                    viewport: viewport
                };
                
                await page.render(renderContext).promise;
            } catch (error) {
                console.error('Thumbnail rendering error:', error);
            }
        }
    }

    updateActiveThumbnail() {
        const thumbnails = this.elements.thumbnailContainer.getElementsByClassName('thumbnail');
        Array.from(thumbnails).forEach((thumb, index) => {
            if (index === this.pageNum - 1) {
                thumb.classList.add('active');
            } else {
                thumb.classList.remove('active');
            }
        });
    }

    previousPage() {
        if (this.pageNum <= 1) return;
        this.pageNum--;
        this.renderPage(this.pageNum);
    }

    nextPage() {
        if (this.pageNum >= this.pdfDoc.numPages) return;
        this.pageNum++;
        this.renderPage(this.pageNum);
    }

    zoomIn() {
        this.scale += 0.1;
        this.updateZoom();
        this.renderPage(this.pageNum);
    }

    zoomOut() {
        if (this.scale > 0.2) {
            this.scale -= 0.1;
            this.updateZoom();
            this.renderPage(this.pageNum);
        }
    }

    async fitToWidth() {
        if (!this.pdfDoc) return;
        
        const page = await this.pdfDoc.getPage(this.pageNum);
        const containerWidth = this.elements.viewerContainer.clientWidth - 40; // Account for padding
        const pageWidth = page.getViewport({ scale: 1 }).width;
        
        this.scale = containerWidth / pageWidth;
        this.updateZoom();
        this.renderPage(this.pageNum);
    }

    async fitToHeight() {
        if (!this.pdfDoc) return;
        
        const page = await this.pdfDoc.getPage(this.pageNum);
        const containerHeight = this.elements.viewerContainer.clientHeight - 40; // Account for padding
        const pageHeight = page.getViewport({ scale: 1 }).height;
        
        this.scale = containerHeight / pageHeight;
        this.updateZoom();
        this.renderPage(this.pageNum);
    }

    updateZoom() {
        this.elements.zoomLevel.textContent = Math.round(this.scale * 100) + '%';
    }

    updatePageControls() {
        this.elements.pageNum.value = this.pageNum;
        this.elements.pageCount.textContent = 'of ' + (this.pdfDoc ? this.pdfDoc.numPages : 0);
        
        this.elements.prevPage.disabled = this.pageNum <= 1;
        this.elements.nextPage.disabled = this.pageNum >= (this.pdfDoc ? this.pdfDoc.numPages : 0);
    }

    showLoading() {
        this.elements.loading.style.display = 'block';
    }

    hideLoading() {
        this.elements.loading.style.display = 'none';
    }

    showError(message) {
        this.elements.error.textContent = message;
        this.elements.error.style.display = 'block';
    }

    hideError() {
        this.elements.error.style.display = 'none';
    }
}

// Initialize the PDF reader when the page loads
document.addEventListener('DOMContentLoaded', () => {
    new PDFReader();
});