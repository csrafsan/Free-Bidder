// Content script to inject a floating "Prepare Bid" button on Freelancer.com job posts
(function() {
    'use strict';

    // Function to create and inject the floating "Prepare Bid" button
    function createFloatingPrepareBidButton() {
        // Check if button already exists
        if (document.getElementById('floating-prepare-bid-btn')) {
            return;
        }

        // Create the floating button container
        const floatingButton = document.createElement('div');
        floatingButton.id = 'floating-prepare-bid-btn';
        floatingButton.innerHTML = `
            <div class="floating-btn-content">
                <span class="floating-btn-icon">🤖</span>
                <span class="floating-btn-text">Prepare Bid</span>
            </div>
        `;
        floatingButton.title = 'Open ChatGPT to prepare your bid proposal';

        // Add styles for the floating button and side panel
        const style = document.createElement('style');
        style.textContent = `
            #floating-prepare-bid-btn {
                position: fixed;
                top: 50%;
                right: 20px;
                transform: translateY(-50%);
                z-index: 10000;
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                border: none;
                border-radius: 50px;
                padding: 12px 20px;
                cursor: grab;
                box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
                transition: all 0.3s ease;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                font-size: 14px;
                font-weight: 600;
                user-select: none;
                backdrop-filter: blur(10px);
                border: 1px solid rgba(255, 255, 255, 0.2);
            }

            #floating-prepare-bid-btn:hover {
                transform: translateY(-50%) scale(1.05);
                box-shadow: 0 6px 25px rgba(0, 0, 0, 0.4);
                background: linear-gradient(135deg, #764ba2 0%, #667eea 100%);
            }

            #floating-prepare-bid-btn:active {
                transform: translateY(-50%) scale(0.95);
            }

            #floating-prepare-bid-btn.dragging {
                cursor: grabbing;
                transition: none;
                transform: scale(1.1);
                box-shadow: 0 8px 30px rgba(0, 0, 0, 0.5);
                z-index: 10002;
            }

            .floating-btn-content {
                display: flex;
                align-items: center;
                gap: 8px;
                white-space: nowrap;
                pointer-events: none;
            }

            .floating-btn-icon {
                font-size: 16px;
                line-height: 1;
            }

            .floating-btn-text {
                font-size: 13px;
                font-weight: 600;
            }

            /* Side Panel Styles */
            #bid-prompt-panel {
                position: fixed;
                top: 0;
                right: -450px;
                width: 450px;
                height: 100vh;
                background: #ffffff;
                box-shadow: -5px 0 25px rgba(0, 0, 0, 0.2);
                z-index: 10001;
                transition: right 0.3s ease;
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                display: flex;
                flex-direction: column;
                border-left: 1px solid #e1e5e9;
            }

            #bid-prompt-panel.open {
                right: 0;
            }

            .panel-header {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                padding: 20px;
                font-size: 18px;
                font-weight: 600;
                display: flex;
                justify-content: space-between;
                align-items: center;
            }

            .panel-close {
                background: none;
                border: none;
                color: white;
                font-size: 24px;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background 0.2s;
            }

            .panel-close:hover {
                background: rgba(255, 255, 255, 0.2);
            }

            .panel-content {
                padding: 20px;
                flex: 1;
                display: flex;
                flex-direction: column;
                gap: 15px;
                overflow-y: auto;
            }

            .job-info {
                background: #f8f9fa;
                padding: 15px;
                border-radius: 8px;
                border-left: 4px solid #667eea;
            }

            .job-info h3 {
                margin: 0 0 10px 0;
                color: #333;
                font-size: 16px;
            }

            .job-info p {
                margin: 5px 0;
                color: #666;
                font-size: 14px;
            }

            .prompt-section {
                flex: 1;
                display: flex;
                flex-direction: column;
            }

            .prompt-section label {
                font-weight: 600;
                color: #333;
                margin-bottom: 8px;
                display: block;
            }

            #prompt-textarea {
                flex: 1;
                min-height: 300px;
                padding: 15px;
                border: 2px solid #e1e5e9;
                border-radius: 8px;
                font-family: inherit;
                font-size: 14px;
                line-height: 1.5;
                resize: none;
                outline: none;
                transition: border-color 0.2s;
            }

            #prompt-textarea:focus {
                border-color: #667eea;
            }

            .panel-footer {
                padding: 20px;
                border-top: 1px solid #e1e5e9;
                display: flex;
                gap: 10px;
            }

            .btn {
                padding: 12px 24px;
                border: none;
                border-radius: 6px;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.2s;
                font-size: 14px;
            }

            .btn-primary {
                background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
                color: white;
                flex: 1;
            }

            .btn-primary:hover {
                transform: translateY(-1px);
                box-shadow: 0 4px 12px rgba(102, 126, 234, 0.4);
            }

            .btn-secondary {
                background: #f8f9fa;
                color: #666;
                border: 1px solid #e1e5e9;
            }

            .btn-secondary:hover {
                background: #e9ecef;
            }

            /* Responsive adjustments */
            @media (max-width: 768px) {
                #floating-prepare-bid-btn {
                    right: 15px;
                    padding: 10px 16px;
                }
                
                .floating-btn-text {
                    font-size: 12px;
                }

                #bid-prompt-panel {
                    width: 100vw;
                    right: -100vw;
                }
            }

            /* Hide on very small screens or show only icon */
            @media (max-width: 480px) {
                .floating-btn-text {
                    display: none;
                }
                
                #floating-prepare-bid-btn {
                    padding: 12px;
                    border-radius: 50%;
                    width: 44px;
                    height: 44px;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                
                .floating-btn-content {
                    gap: 0;
                }
            }

            /* Panel overlay for mobile */
            #panel-overlay {
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: rgba(0, 0, 0, 0.5);
                z-index: 10000;
                opacity: 0;
                visibility: hidden;
                transition: all 0.3s ease;
            }

            #panel-overlay.show {
                opacity: 1;
                visibility: visible;
            }

            @media (min-width: 769px) {
                #panel-overlay {
                    display: none !important;
                }
            }
        `;

        // Add the styles to the document head
        document.head.appendChild(style);

        // Create side panel
        const sidePanel = document.createElement('div');
        sidePanel.id = 'bid-prompt-panel';
        sidePanel.innerHTML = `
            <div class="panel-header">
                <span>Prepare Bid Proposal</span>
                <button class="panel-close" id="close-panel">&times;</button>
            </div>
            <div class="panel-content">
                <div class="job-info" id="job-info">
                    <h3>Job Information</h3>
                    <p><strong>Loading job details...</strong></p>
                </div>
                <div class="prompt-section">
                    <label for="prompt-textarea">Edit your prompt:</label>
                    <textarea id="prompt-textarea" placeholder="Your prompt will appear here..."></textarea>
                </div>
            </div>
            <div class="panel-footer">
                <button class="btn btn-secondary" id="cancel-btn">Cancel</button>
                <button class="btn btn-primary" id="prepare-bid-btn">🤖 Prepare Bid</button>
            </div>
        `;

        // Create overlay for mobile
        const overlay = document.createElement('div');
        overlay.id = 'panel-overlay';

        // Add elements to page
        document.body.appendChild(overlay);
        document.body.appendChild(sidePanel);

        // Drag functionality variables
        let isDragging = false;
        let dragStartX = 0;
        let dragStartY = 0;
        let dragOffsetX = 0;
        let dragOffsetY = 0;
        let hasDragged = false;

        // Mouse events for dragging
        floatingButton.addEventListener('mousedown', function(e) {
            e.preventDefault();
            isDragging = true;
            hasDragged = false;
            
            const rect = floatingButton.getBoundingClientRect();
            dragOffsetX = e.clientX - rect.left;
            dragOffsetY = e.clientY - rect.top;
            dragStartX = e.clientX;
            dragStartY = e.clientY;
            
            floatingButton.classList.add('dragging');
            document.addEventListener('mousemove', handleMouseMove);
            document.addEventListener('mouseup', handleMouseUp);
        });

        // Touch events for mobile dragging
        floatingButton.addEventListener('touchstart', function(e) {
            e.preventDefault();
            isDragging = true;
            hasDragged = false;
            
            const touch = e.touches[0];
            const rect = floatingButton.getBoundingClientRect();
            dragOffsetX = touch.clientX - rect.left;
            dragOffsetY = touch.clientY - rect.top;
            dragStartX = touch.clientX;
            dragStartY = touch.clientY;
            
            floatingButton.classList.add('dragging');
            document.addEventListener('touchmove', handleTouchMove, { passive: false });
            document.addEventListener('touchend', handleTouchEnd);
        });

        function handleMouseMove(e) {
            if (!isDragging) return;
            
            const moveDistance = Math.abs(e.clientX - dragStartX) + Math.abs(e.clientY - dragStartY);
            if (moveDistance > 5) {
                hasDragged = true;
            }
            
            updateButtonPosition(e.clientX, e.clientY);
        }

        function handleTouchMove(e) {
            if (!isDragging) return;
            e.preventDefault();
            
            const touch = e.touches[0];
            const moveDistance = Math.abs(touch.clientX - dragStartX) + Math.abs(touch.clientY - dragStartY);
            if (moveDistance > 5) {
                hasDragged = true;
            }
            
            updateButtonPosition(touch.clientX, touch.clientY);
        }

        function updateButtonPosition(clientX, clientY) {
            const newX = clientX - dragOffsetX;
            const newY = clientY - dragOffsetY;
            
            // Get viewport dimensions
            const viewportWidth = window.innerWidth;
            const viewportHeight = window.innerHeight;
            const buttonRect = floatingButton.getBoundingClientRect();
            
            // Constrain to viewport
            const constrainedX = Math.max(0, Math.min(newX, viewportWidth - buttonRect.width));
            const constrainedY = Math.max(0, Math.min(newY, viewportHeight - buttonRect.height));
            
            // Apply position
            floatingButton.style.left = constrainedX + 'px';
            floatingButton.style.top = constrainedY + 'px';
            floatingButton.style.right = 'auto';
            floatingButton.style.transform = 'none';
        }

        function handleMouseUp(e) {
            if (!isDragging) return;
            
            isDragging = false;
            floatingButton.classList.remove('dragging');
            
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            
            // Only open panel if not dragged
            if (!hasDragged) {
                setTimeout(() => {
                    openSidePanel();
                }, 100);
            }
        }

        function handleTouchEnd(e) {
            if (!isDragging) return;
            
            isDragging = false;
            floatingButton.classList.remove('dragging');
            
            document.removeEventListener('touchmove', handleTouchMove);
            document.removeEventListener('touchend', handleTouchEnd);
            
            // Only open panel if not dragged
            if (!hasDragged) {
                setTimeout(() => {
                    openSidePanel();
                }, 100);
            }
        }

        // Original click event (now only for keyboard/accessibility)
        floatingButton.addEventListener('click', function(e) {
            // Prevent default click behavior when dragging
            if (hasDragged) {
                e.preventDefault();
                e.stopPropagation();
                return;
            }
        });

        // Panel event listeners
        document.getElementById('close-panel').addEventListener('click', closeSidePanel);
        document.getElementById('cancel-btn').addEventListener('click', closeSidePanel);
        overlay.addEventListener('click', closeSidePanel);

        document.getElementById('prepare-bid-btn').addEventListener('click', function() {
            const prompt = document.getElementById('prompt-textarea').value.trim();
            if (prompt) {
                openChatGPT(prompt);
                closeSidePanel();
            }
        });

        // Function to open side panel
        function openSidePanel() {
            // Get job details
            const jobTitle = document.querySelector('h1')?.textContent?.trim() || 
                           document.querySelector('[data-testid="project-title"]')?.textContent?.trim() ||
                           document.querySelector('.PageProjectViewLogout-header h1')?.textContent?.trim() ||
                           'Job';
            
            const jobDescription = document.querySelector('.Project-description')?.textContent?.trim() || 
                                 document.querySelector('[data-testid="project-description"]')?.textContent?.trim() ||
                                 document.querySelector('.PageProjectViewLogout-detail')?.textContent?.trim() ||
                                 '';
            
            const budget = document.querySelector('h2')?.textContent?.trim() || 
                         document.querySelector('[data-testid="project-budget"]')?.textContent?.trim() ||
                         document.querySelector('.Project-budget')?.textContent?.trim() ||
                         '';
            
            // Get skills if available
            const skillElements = document.querySelectorAll('.Tag, .project-tag, [data-testid="project-skills"] span');
            const skills = Array.from(skillElements).map(el => el.textContent?.trim()).filter(Boolean).join(', ');
            
            // Update job info
            const jobInfo = document.getElementById('job-info');
            jobInfo.innerHTML = `
                <h3>Job Information</h3>
                <p><strong>Title:</strong> ${jobTitle}</p>
                ${budget ? `<p><strong>Budget:</strong> ${budget}</p>` : ''}
                ${skills ? `<p><strong>Skills:</strong> ${skills}</p>` : ''}
                <p><strong>Description:</strong> ${jobDescription.substring(0, 200)}${jobDescription.length > 200 ? '...' : ''}</p>
            `;

            // Create the prompt
            const prompt = `Prepare bid proposal for me for this freelance job within 1400 characters:

Title: ${jobTitle}
${budget ? `Budget: ${budget}` : ''}
${skills ? `Required Skills: ${skills}` : ''}

Description: ${jobDescription.substring(0, 800)}${jobDescription.length > 800 ? '...' : ''}

Please help me create a professional and compelling bid proposal that:
1. Addresses the client's specific requirements
2. Showcases my relevant skills and experience
3. Demonstrates understanding of the project scope
4. Includes a clear approach to completing the work
5. Has a professional and engaging tone

Make it personalized and avoid generic templates.`;

            // Set prompt in textarea
            document.getElementById('prompt-textarea').value = prompt;

            // Show panel
            sidePanel.classList.add('open');
            overlay.classList.add('show');
        }

        // Function to close side panel
        function closeSidePanel() {
            sidePanel.classList.remove('open');
            overlay.classList.remove('show');
        }

        // Function to open ChatGPT with prompt
        function openChatGPT(prompt) {
            const encodedPrompt = encodeURIComponent(prompt);
            const chatGptUrl = `https://chatgpt.com/?q=${encodedPrompt}`;
            
            // Use chrome.runtime.sendMessage if available, otherwise open directly
            if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
                chrome.runtime.sendMessage({
                    action: 'openChatGPT',
                    url: chatGptUrl
                });
            } else {
                // Fallback: open in new tab directly
                window.open(chatGptUrl, '_blank');
            }
        }

        // Insert the button into the page
        document.body.appendChild(floatingButton);

        console.log('Floating Prepare Bid button added successfully');
    }

    // Function to check if we're on a job/project page
    function isJobPage() {
        return window.location.href.includes('/projects/') || 
               document.querySelector('.Project-description') ||
               document.querySelector('[data-testid="project-description"]') ||
               document.querySelector('.PageProjectViewLogout-detail');
    }

    // Function to initialize the extension
    function initializeExtension() {
        // Only create button on job pages
        if (isJobPage()) {
            createFloatingPrepareBidButton();
        }

        // Set up a mutation observer to handle navigation and dynamic content
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if we navigated to a job page
                    if (isJobPage() && !document.getElementById('floating-prepare-bid-btn')) {
                        setTimeout(createFloatingPrepareBidButton, 500);
                    }
                    // Remove button if we're no longer on a job page
                    else if (!isJobPage() && document.getElementById('floating-prepare-bid-btn')) {
                        const existingButton = document.getElementById('floating-prepare-bid-btn');
                        if (existingButton) {
                            existingButton.remove();
                        }
                    }
                }
            });
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Also check on URL changes (for single-page app navigation)
        let currentUrl = window.location.href;
        setInterval(() => {
            if (window.location.href !== currentUrl) {
                currentUrl = window.location.href;
                setTimeout(() => {
                    if (isJobPage() && !document.getElementById('floating-prepare-bid-btn')) {
                        createFloatingPrepareBidButton();
                    } else if (!isJobPage() && document.getElementById('floating-prepare-bid-btn')) {
                        const existingButton = document.getElementById('floating-prepare-bid-btn');
                        if (existingButton) {
                            existingButton.remove();
                        }
                    }
                }, 1000);
            }
        }, 500);
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeExtension);
    } else {
        initializeExtension();
    }

    // Also initialize when the page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(initializeExtension, 1000);
    });
})();