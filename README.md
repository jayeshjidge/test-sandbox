# 💕 Our 3 Beautiful Years Together - Anniversary Website

A romantic, interactive website celebrating your 3-year relationship anniversary. This website includes beautiful animations, a relationship quiz, photo gallery, timeline, love letter, and comprehensive interaction tracking to show your girlfriend how much effort you've put into this surprise!

## ✨ Features

### 🎨 **Beautiful Design**
- Romantic color scheme with pink gradients
- Floating heart animations
- Smooth scrolling and hover effects
- Fully responsive design for all devices

### 📱 **Interactive Sections**
1. **Hero Section** - Welcome message with your photo
2. **Timeline** - Your 3-year journey together
3. **Memory Gallery** - Photo collection with modal popups
4. **Relationship Quiz** - 5 questions about your relationship
5. **Love Letter** - Personal message from your heart
6. **Analytics Tracking** - See exactly how she interacts with the site

### 📊 **Interaction Tracking**
The website secretly tracks:
- ⏱️ Time spent on the site
- 📍 Which sections she visits
- 🖱️ What she clicks on
- 📝 Quiz answers and scores
- 📱 Device and browser information
- 🎯 Scroll behavior

## 🚀 Quick Setup Guide

### Step 1: Personalize the Content

Before deploying, customize these elements:

#### In `index.html`:
- Replace `[Your Anniversary Date]` with your actual anniversary date
- Replace `[Her Name]` with your girlfriend's name
- Replace `[Your Name]` with your name
- Update the quiz questions and answers to match your relationship
- Replace placeholder images with your actual photos

#### Photo Replacements:
Replace these placeholder images with your real photos:
- Hero photo: `https://via.placeholder.com/400x300/ff69b4/ffffff?text=Our+First+Photo`
- Timeline photos (3 images for each year)
- Memory gallery photos (4 images)

### Step 2: Update Quiz Questions

In `index.html`, customize the quiz questions in the `#quiz` section:
- Make questions specific to your relationship
- Update the correct answers in `script.js` (lines 85-91)

### Step 3: Personalize the Love Letter

In `index.html`, edit the love letter section to make it personal and specific to your relationship.

## 🌐 Deployment Options

### Option 1: GitHub Pages (Recommended - Free)

1. **Create a GitHub Repository:**
   ```bash
   # If you haven't already, initialize git in your project folder
   cd /Users/jayesh.jidge/Desktop/Repository/website
   git init
   git add .
   git commit -m "Initial commit: Anniversary website"
   ```

2. **Push to GitHub:**
   - Create a new repository on GitHub (name it something like `anniversary-website`)
   - Follow GitHub's instructions to push your code:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/anniversary-website.git
   git branch -M main
   git push -u origin main
   ```

3. **Enable GitHub Pages:**
   - Go to your repository settings
   - Scroll to "Pages" section
   - Select "Deploy from a branch"
   - Choose "main" branch and "/ (root)" folder
   - Click "Save"
   - Your site will be available at: `https://YOUR_USERNAME.github.io/anniversary-website`

### Option 2: Netlify (Free)

1. **Drag and Drop Method:**
   - Go to [netlify.com](https://netlify.com)
   - Drag your website folder to the deployment area
   - Get instant URL

2. **GitHub Integration:**
   - Connect your GitHub repository
   - Auto-deploy on every update

### Option 3: Vercel (Free)

1. **GitHub Integration:**
   - Go to [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Auto-deploy with custom domain options

### Option 4: Firebase Hosting (Free)

1. **Install Firebase CLI:**
   ```bash
   npm install -g firebase-tools
   ```

2. **Deploy:**
   ```bash
   firebase login
   firebase init hosting
   firebase deploy
   ```

## 📊 How to Check Her Interactions

After she visits the website, you can see her interactions in several ways:

### Method 1: Browser Console (If you have access)
1. Open the website
2. Press F12 (Developer Tools)
3. Go to Console tab
4. Type: `getAnalyticsData()`
5. Press Enter to see all tracked data

### Method 2: Local Storage (If you have access)
1. Open Developer Tools (F12)
2. Go to Application tab
3. Click on Local Storage
4. Look for entries starting with "websiteAnalytics"

### Method 3: Server Integration (Advanced)
You can modify the `analytics.logInteraction()` function in `script.js` to send data to a server:

```javascript
// Add this to the logInteraction method
fetch('YOUR_SERVER_ENDPOINT', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
});
```

## 🎯 What You'll Learn About Her Visit

The analytics will show you:
- **Total time spent** on the website
- **Which sections** she spent the most time on
- **Quiz performance** - her answers and score
- **Photo interactions** - which memories she clicked on
- **Scroll behavior** - how engaged she was
- **Device info** - what device she used
- **Return visits** - if she comes back multiple times

## 🛠️ Customization Tips

### Adding More Photos
1. Upload photos to an image hosting service (like Imgur, Google Photos, or include them in your repository)
2. Replace the placeholder URLs in the HTML
3. Update the `memories` object in `script.js` with new descriptions

### Adding More Quiz Questions
1. Add new question HTML in the quiz section
2. Update the `totalQuestions` variable in `script.js`
3. Add correct answers to the `correctAnswers` object

### Changing Colors
The main colors are defined in `styles.css`:
- Primary pink: `#ff69b4`
- Secondary pink: `#ff1493`
- You can search and replace these with your preferred colors

### Adding Music
Add background music by including this in the `<head>` section:
```html
<audio autoplay loop>
    <source src="your-song.mp3" type="audio/mpeg">
</audio>
```

## 📱 Mobile Optimization

The website is fully responsive and will look great on:
- 📱 Mobile phones
- 📱 Tablets
- 💻 Laptops
- 🖥️ Desktop computers

## 🔒 Privacy Note

All interaction tracking is stored locally in the browser and doesn't send data anywhere unless you specifically set up a server endpoint. The tracking is designed to help you understand how much she engages with your thoughtful creation.

## 💡 Pro Tips

1. **Test First**: Visit the site yourself to make sure everything works
2. **Share Thoughtfully**: Send her the link with a sweet message
3. **Check Analytics**: Wait a day or two, then check the analytics
4. **Follow Up**: Use what you learn to plan future surprises
5. **Keep It Updated**: Add new photos and memories over time

## 🎉 Surprise Ideas

- Send her the link with a message like: "I made something special for you 💕"
- Share it on a special date or when she's feeling down
- Use the analytics to plan your next romantic gesture
- Create a new section for each anniversary

## 🆘 Troubleshooting

### Images Not Loading
- Make sure image URLs are correct and publicly accessible
- Consider uploading images to your repository instead of using external links

### Website Not Deploying
- Check that all files are in the root directory
- Ensure `index.html` is in the main folder
- Verify there are no syntax errors in your HTML/CSS/JS

### Analytics Not Working
- Check browser console for errors
- Make sure JavaScript is enabled
- Test in different browsers

## 💌 Final Message

This website is more than just code - it's a digital love letter that shows your effort, creativity, and dedication to your relationship. The fact that you're creating something this thoughtful proves how much you care.

Remember to personalize every detail to make it truly special for your relationship. Good luck, and I hope she loves it! 💕

---

**Made with ❤️ for love that deserves to be celebrated**
