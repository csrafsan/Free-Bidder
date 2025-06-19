// Content script to inject the "Prepare Bid" button into Freelancer.com job posts
(function() {
    'use strict';

    // Function to create and inject the "Prepare Bid" button
    function createPrepareBidButton() {
        // Check if button already exists
        if (document.getElementById('prepare-bid-btn')) {
            return;
        }

        // Find the bid form or project heading area
        const bidForm = document.querySelector('[data-margin-bottom="small"] .BidCta') || 
                       document.querySelector('.Project-heading') ||
                       document.querySelector('[class*="Project-heading"]');

        if (!bidForm) {
            console.log('Bid form or project heading not found, retrying...');
            return;
        }

        // Create the button
        const prepareBidButton = document.createElement('button');
        prepareBidButton.id = 'prepare-bid-btn';
        prepareBidButton.className = 'prepare-bid-button';
        prepareBidButton.innerHTML = '🤖 Prepare Bid';
        prepareBidButton.title = 'Open ChatGPT to prepare your bid proposal';

        // Add click event listener
        prepareBidButton.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            // Get job details
            const jobTitle = document.querySelector('h1')?.textContent?.trim() || 'Job';
            const jobDescription = document.querySelector('.Project-description')?.textContent?.trim() || '';
            const budget = document.querySelector('h2')?.textContent?.trim() || '';
            
            // Create the prompt with job details
            const prompt = `Prepare bid proposal for me for this freelance job:

Title: ${jobTitle}
Budget: ${budget}
Description: ${jobDescription.substring(0, 500)}${jobDescription.length > 500 ? '...' : ''}

Please help me create a professional and compelling bid proposal that addresses the client's requirements and showcases my relevant skills and experience.`;

            // Encode the prompt for URL
            const encodedPrompt = encodeURIComponent(prompt);
            
            // Open ChatGPT in a new tab with the prompt
            const chatGptUrl = `https://chatgpt.com/?q=${encodedPrompt}`;
            chrome.runtime.sendMessage({
                action: 'openChatGPT',
                url: chatGptUrl
            });
        });

        // Insert the button
        if (bidForm.tagName === 'BUTTON') {
            // If bidForm is the bid button itself, insert before it
            bidForm.parentNode.insertBefore(prepareBidButton, bidForm);
        } else {
            // Otherwise, append to the container
            bidForm.appendChild(prepareBidButton);
        }

        console.log('Prepare Bid button added successfully');
    }

    // Function to observe DOM changes and inject button when needed
    function initializeExtension() {
        // Try to create button immediately
        createPrepareBidButton();

        // Set up a mutation observer to handle dynamic content loading
        const observer = new MutationObserver(function(mutations) {
            mutations.forEach(function(mutation) {
                if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
                    // Check if new content was added that might contain our target elements
                    const hasRelevantContent = Array.from(mutation.addedNodes).some(node => {
                        return node.nodeType === Node.ELEMENT_NODE && 
                               (node.querySelector && 
                                (node.querySelector('.Project-heading') || 
                                 node.querySelector('.BidCta') ||
                                 node.querySelector('[class*="Project"]')));
                    });
                    
                    if (hasRelevantContent) {
                        setTimeout(createPrepareBidButton, 500);
                    }
                }
            });
        });

        // Start observing
        observer.observe(document.body, {
            childList: true,
            subtree: true
        });

        // Also try again after a short delay in case content is still loading
        setTimeout(createPrepareBidButton, 2000);
    }

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeExtension);
    } else {
        initializeExtension();
    }

    // Also try when the page is fully loaded
    window.addEventListener('load', function() {
        setTimeout(createPrepareBidButton, 1000);
    });
})();