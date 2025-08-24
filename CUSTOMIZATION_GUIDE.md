# 🎨 Quick Customization Guide

## 🚀 Before You Deploy - Essential Changes

### 1. **Replace Personal Information**

#### In `index.html`, find and replace:
- `[Your Anniversary Date]` → Your actual anniversary date (e.g., "February 14, 2021")
- `[Her Name]` → Your girlfriend's name
- `[Your Name]` → Your name

### 2. **Update Quiz Questions & Answers**

#### Quiz Questions (in `index.html`):
Current questions are generic. Make them specific to your relationship:

**Question 1**: "Where did we have our first date?"
- Update options A, B, C, D with real places

**Question 2**: "What's my favorite thing about you?"
- Personalize the options

**Question 3**: "What's our favorite song?"
- Replace with your actual favorite songs

**Question 4**: "What's our dream destination?"
- Add places you've actually talked about

**Question 5**: "What do I love most about our relationship?"
- Make it personal to your relationship

#### Quiz Answers (in `script.js`, lines 85-91):
```javascript
const correctAnswers = {
    1: 'A', // Change to the correct letter for question 1
    2: 'D', // Change to the correct letter for question 2
    3: 'D', // Change to the correct letter for question 3
    4: 'D', // Change to the correct letter for question 4
    5: 'D'  // Change to the correct letter for question 5
};
```

### 3. **Replace Photos**

#### Upload your photos and replace these URLs in `index.html`:

**Hero Photo** (line ~45):
```html
<img src="YOUR_PHOTO_URL_HERE" alt="Our beautiful memory" id="hero-photo">
```

**Timeline Photos** (lines ~70, 80, 90):
```html
<img src="YOUR_YEAR_1_PHOTO" alt="Year 1">
<img src="YOUR_YEAR_2_PHOTO" alt="Year 2">
<img src="YOUR_YEAR_3_PHOTO" alt="Year 3">
```

**Memory Gallery Photos** (lines ~105, 115, 125, 135):
```html
<img src="YOUR_MEMORY_1_PHOTO" alt="Memory 1">
<img src="YOUR_MEMORY_2_PHOTO" alt="Memory 2">
<img src="YOUR_MEMORY_3_PHOTO" alt="Memory 3">
<img src="YOUR_MEMORY_4_PHOTO" alt="Memory 4">
```

#### Also update memory descriptions in `script.js` (lines 150-175):
```javascript
const memories = {
    1: {
        title: "Our First Date",
        description: "Write your actual first date story here...",
        image: "YOUR_PHOTO_URL"
    },
    // ... update all 4 memories
};
```

### 4. **Personalize the Love Letter**

In `index.html`, find the `.letter-content` section and rewrite it with your own words. Make it specific to your relationship, mention actual memories, inside jokes, and future plans.

### 5. **Update Timeline Stories**

In the timeline section, replace the generic text with your actual relationship milestones:

**Year 1**: What happened when you first met/started dating
**Year 2**: Major milestones, trips, or growth in your relationship  
**Year 3**: Recent developments, current state of your relationship

## 📸 How to Add Your Photos

### Option 1: Include in Repository
1. Create a folder called `images` in your website folder
2. Add your photos to this folder
3. Reference them like: `src="images/our-first-date.jpg"`

### Option 2: Use Image Hosting
1. Upload to Imgur, Google Photos, or similar
2. Get the direct image URL
3. Use that URL in your HTML

### Option 3: GitHub Repository
1. Upload images to your GitHub repository
2. Use GitHub's raw file URLs
3. Format: `https://raw.githubusercontent.com/USERNAME/REPO/main/images/photo.jpg`

## 🎯 Testing Your Changes

1. Open `index.html` in your browser
2. Check that all personal information is correct
3. Test the quiz with the right answers
4. Verify all photos load properly
5. Read through the love letter to make sure it sounds right

## 🚀 Quick Deploy Checklist

- [ ] Replaced all placeholder names and dates
- [ ] Updated quiz questions and answers
- [ ] Added real photos
- [ ] Personalized the love letter
- [ ] Updated timeline with real stories
- [ ] Updated memory descriptions
- [ ] Tested the website locally
- [ ] Ready to deploy!

## 💡 Pro Tips

- **Keep it authentic**: Use real stories and memories
- **Add inside jokes**: Include things only she would understand
- **Use good photos**: High-quality images make a big difference
- **Test thoroughly**: Make sure everything works before sharing
- **Plan the reveal**: Think about how you'll share the link with her

Remember: The more personal and specific you make it, the more meaningful it will be! 💕
