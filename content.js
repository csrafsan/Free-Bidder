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

        // Add styles for the floating button
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
                cursor: pointer;
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

            .floating-btn-content {
                display: flex;
                align-items: center;
                gap: 8px;
                white-space: nowrap;
            }

            .floating-btn-icon {
                font-size: 16px;
                line-height: 1;
            }

            .floating-btn-text {
                font-size: 13px;
                font-weight: 600;
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
        `;

        // Add the styles to the document head
        document.head.appendChild(style);

        // Add click event listener
        floatingButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Add click animation
            floatingButton.style.transform = 'translateY(-50%) scale(0.9)';
            setTimeout(() => {
                floatingButton.style.transform = 'translateY(-50%) scale(1.05)';
            }, 100);
            
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
            
            // Create the prompt with job details
            const prompt = `Prepare bid proposal for me for this freelance job:

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

            // Encode the prompt for URL
            const encodedPrompt = encodeURIComponent(prompt);
            
            // Open ChatGPT in a new tab with the prompt
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
        });

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