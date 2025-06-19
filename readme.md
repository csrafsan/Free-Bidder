# Freelancer Bid Preparer Chrome Extension

A Chrome extension that helps freelancers quickly prepare bid proposals by integrating with ChatGPT. The extension adds a convenient sidebar button to Freelancer.com job posts that automatically extracts job details and opens ChatGPT with a customized prompt.

## 🚀 Features

- **Smart Job Detection**: Automatically detects when you're viewing a Freelancer.com job post
- **One-Click Bid Preparation**: Single button click to start preparing your bid proposal
- **Automatic Data Extraction**: Extracts job title, budget, and description automatically
- **ChatGPT Integration**: Opens ChatGPT with a pre-filled, professional prompt
- **Clean Sidebar Interface**: Non-intrusive sidebar button that doesn't interfere with the website
- **Professional Styling**: Modern design that integrates seamlessly with Freelancer.com
- **Real-time Content Detection**: Works with dynamically loaded content

## 📦 Installation

### Method 1: Manual Installation (Developer Mode)

1. **Download the Extension Files**
   - Download or clone all the extension files to a local folder
   - Ensure you have all required files:
     - `manifest.json`
     - `content.js`
     - `background.js`
     - `styles.css`
     - `popup.html`

2. **Add Extension Icons** (Optional but Recommended)
   - Create or download icon files: `icon16.png`, `icon48.png`, `icon128.png`
   - Place them in the same folder as other extension files
   - You can use any 16x16, 48x48, and 128x128 pixel images (robot/AI themed recommended)

3. **Load Extension in Chrome**
   - Open Google Chrome
   - Navigate to `chrome://extensions/`
   - Enable **Developer mode** (toggle in the top-right corner)
   - Click **Load unpacked**
   - Select the folder containing your extension files
   - The extension should now appear in your extensions list

4. **Verify Installation**
   - Look for the "Freelancer Bid Preparer" extension in your Chrome toolbar
   - Visit any Freelancer.com job post to test the functionality

### Method 2: Chrome Web Store (Future)
*This extension is currently in development and not yet available on the Chrome Web Store.*

## 🔧 How to Use

1. **Navigate to Freelancer.com**
   - Go to any job post on Freelancer.com
   - Example: `https://www.freelancer.com/projects/flutter/...`

2. **Look for the Sidebar Button**
   - A "🤖 Prepare Bid" button will appear on the right side of the page
   - The button appears automatically when the page loads

3. **Click to Prepare Your Bid**
   - Click the "🤖 Prepare Bid" button
   - The extension will automatically:
     - Extract the job title, budget, and description
     - Open ChatGPT in a new tab
     - Pre-fill a professional prompt with the job details

4. **Review and Customize**
   - Review the generated prompt in ChatGPT
   - Let ChatGPT help you create a compelling bid proposal
   - Copy the proposal back to Freelancer.com

## 💡 Example Usage

When you click the "Prepare Bid" button on a FlutterFlow & Supabase developer job post, ChatGPT will open with a prompt like:

```
Prepare bid proposal for me for this freelance job:

Title: FlutterFlow & Supabase Developer Needed
Budget: £5-10 GBP / hour
Description: I'm building a project using FlutterFlow and Supabase and need an experienced developer for occasional tasks...

Please help me create a professional and compelling bid proposal that addresses the client's requirements and showcases my relevant skills and experience.
```

## 🛠️ Technical Details

### Permissions Used
- `activeTab`: To interact with the current Freelancer.com tab
- `tabs`: To open new ChatGPT tabs
- `host_permissions`: Access to Freelancer.com domains

### Supported URLs
- `https://www.freelancer.com/projects/*`
- `https://freelancer.com/projects/*`

### Browser Compatibility
- Chrome (Manifest V3)
- Edge (Chromium-based)
- Other Chromium-based browsers

## 🔍 Troubleshooting

### Extension Not Working
1. **Check Extension Status**
   - Go to `chrome://extensions/`
   - Ensure "Freelancer Bid Preparer" is enabled
   - Check for any error messages

2. **Refresh the Page**
   - Sometimes a page refresh is needed after installing
   - Try reloading the Freelancer.com job post

3. **Check URL Format**
   - Ensure you're on a job post page (`/projects/` in the URL)
   - The extension only works on job post pages, not job search pages

### Button Not Appearing
1. **Wait for Page Load**
   - The button appears after the page content loads
   - On slow connections, it may take a few seconds

2. **Check for Dynamic Content**
   - Some job posts load content dynamically
   - Try scrolling down and back up to trigger content detection

3. **Clear Extension Data**
   - Disable and re-enable the extension
   - Reload the page

### ChatGPT Not Opening
1. **Check Popup Blockers**
   - Ensure Chrome isn't blocking popups for the extension
   - Check `chrome://settings/content/popups`

2. **Verify Internet Connection**
   - Ensure you can access ChatGPT.com manually

## 🚧 Future Enhancements

- **Custom Prompt Templates**: Create and save your own bid preparation prompts
- **Bid History**: Track and save your bid proposals
- **Multiple AI Integration**: Support for other AI services beyond ChatGPT
- **Advanced Job Parsing**: Better extraction of skills, requirements, and deadlines
- **Proposal Templates**: Pre-built templates for different job types
- **Analytics**: Track your bidding success rate

## 🤝 Contributing

This extension is in active development. Future versions will include:
- Better error handling
- More customization options
- Support for other freelancing platforms
- Enhanced job detail extraction

## 📝 License

This project is open source and available under the MIT License.

## ⚠️ Disclaimer

This extension is not affiliated with Freelancer.com or OpenAI (ChatGPT). It's a third-party tool designed to help freelancers work more efficiently. Always review and customize any AI-generated content before submitting your proposals.

## 📞 Support

For issues, questions, or feature requests, please create an issue in the project repository or contact the developer.

---

**Version:** 1.0  
**Last Updated:** June 2025  
**Compatibility:** Chrome 88+, Manifest V3