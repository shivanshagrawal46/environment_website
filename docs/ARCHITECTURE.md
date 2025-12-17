# TERRA Environmental NGO Website - Architecture Documentation

## 🏗️ Project Structure

```
environment_website/
├── public/
│   ├── images/
│   │   ├── character.png
│   │   ├── hero-mountain.png
│   │   ├── forest-path.png
│   │   ├── lake-mountain.png
│   │   ├── mountain-peak (1).png
│   │   └── download1-13.png
│   └── videos/
│       ├── nature-video-1 (1).mp4
│       └── nature-video-2 (1).mp4
├── src/
│   ├── components/
│   │   ├── common/
│   │   │   ├── Navigation.jsx
│   │   │   └── Footer.jsx
│   │   └── sections/
│   │       ├── Hero.jsx
│   │       ├── About.jsx
│   │       ├── Projects.jsx
│   │       ├── Impact.jsx
│   │       ├── Initiatives.jsx
│   │       ├── VisualStory.jsx
│   │       ├── Team.jsx
│   │       ├── Partners.jsx
│   │       ├── Donate.jsx
│   │       ├── News.jsx
│   │       └── Contact.jsx
│   ├── hooks/
│   │   ├── useScrollAnimation.js
│   │   └── useInView.js
│   ├── data/
│   │   ├── projectsData.js
│   │   └── impactData.js
│   ├── styles/
│   │   ├── Navigation.css
│   │   ├── Hero.css
│   │   ├── About.css
│   │   ├── Projects.css
│   │   ├── Impact.css
│   │   ├── Initiatives.css
│   │   ├── VisualStory.css
│   │   ├── Team.css
│   │   ├── Partners.css
│   │   ├── Donate.css
│   │   ├── News.css
│   │   ├── Contact.css
│   │   └── Footer.css
│   ├── App.jsx
│   ├── App.css
│   ├── main.jsx
│   └── index.css
└── package.json
```

## 🎨 Design Philosophy

### Award-Winning Features
- **Minimalist & Elegant Design**: Subtle earthy color palette
- **Smooth Animations**: Framer Motion for premium interactions
- **Scroll-Based Effects**: Parallax and fade animations
- **Responsive**: Perfect on all devices
- **Accessibility**: WCAG compliant with keyboard navigation

### Color Palette
- **Primary Dark**: `#1a1a1a` - Deep charcoal
- **Primary Light**: `#f8f7f4` - Warm off-white
- **Accent Green**: `#4a6741` - Forest green
- **Accent Sage**: `#8b9d83` - Muted sage
- **Text Primary**: `#2d2d2d` - Dark gray
- **Text Secondary**: `#6b6b6b` - Medium gray

## 📦 Component Architecture

### Common Components
1. **Navigation**
   - Fixed header with smooth scroll
   - Mobile responsive menu
   - Dynamic active states

2. **Footer**
   - Comprehensive site map
   - Social links
   - Back-to-top button

### Section Components
1. **Hero** - Full-screen video background with powerful messaging
2. **About** - Mission statement with feature boxes
3. **Projects** - Filterable portfolio grid (8 projects)
4. **Impact** - Animated statistics dashboard (8 metrics)
5. **Initiatives** - Core programs with imagery
6. **VisualStory** - Dark section with alternating image layouts + video
7. **Team** - Team members grid with career CTA
8. **Partners** - Testimonials + Partnership CTA
9. **Donate** - Interactive donation form with impact calculator
10. **News** - Latest updates grid
11. **Contact** - Form + contact information
12. **Footer** - Site navigation and legal

## 🎣 Custom Hooks

### `useScrollAnimation`
Provides scroll-based animation values:
- `scrollYProgress` - Overall scroll progress
- `heroOpacity` - Fade out hero on scroll
- `heroScale` - Scale down hero on scroll
- `parallaxY` - Parallax effect value

### `useInView`
Detects when elements enter viewport:
- `ref` - Reference to attach to element
- `isInView` - Boolean indicating visibility
- Configurable margin and once options

## 📊 Data Structure

### `projectsData.js`
8 projects with:
- Title, description, category
- Image, location, impact metrics

### `impactData.js`
- 8 impact statistics with icons
- 4 initiative programs with images

## 🎬 Animations

### Entry Animations
- Fade in from bottom
- Slide in from left/right
- Scale animations
- Stagger effects on grids

### Hover Effects
- Scale transformations
- Color transitions
- Shadow enhancements
- Arrow movements

### Scroll Animations
- Parallax effects
- Opacity changes
- Progress-based transformations

## 🔧 Technology Stack

- **React 18**: Modern hooks and patterns
- **Framer Motion**: Premium animations
- **Vite**: Lightning-fast development
- **CSS Modules**: Scoped styling per component

## 📱 Responsive Breakpoints

- **Desktop**: > 1024px (Full layout)
- **Tablet**: 768px - 1024px (2-column grids)
- **Mobile**: < 768px (Single column, hamburger menu)

## 🚀 Performance Optimizations

- Lazy loading for images
- Video optimization (autoplay, loop, muted)
- Smooth scroll behavior
- Efficient re-renders with React hooks
- CSS animations over JavaScript

## ♿ Accessibility Features

- Semantic HTML
- ARIA labels
- Keyboard navigation support
- Focus visible states
- Alt text for all images
- Proper heading hierarchy

## 🎯 Key Features for Corporate Clients

1. **Trust Indicators**: Statistics, testimonials, certifications
2. **ESG Integration**: Compliance and reporting features
3. **Professional Aesthetics**: Clean, modern, premium feel
4. **Transparency**: Clear impact metrics and data
5. **Easy Contact**: Multiple ways to get in touch
6. **Partnership Options**: Dedicated sections for corporate engagement

## 📈 Sections Summary

| Section | Purpose | Images Used |
|---------|---------|-------------|
| Hero | First impression | nature-video-1 |
| About | Mission & values | download1 |
| Projects | Portfolio showcase | download2-9 (8 projects) |
| Impact | Statistics dashboard | Icons only |
| Initiatives | Core programs | download10-13 |
| Visual Story | Immersive storytelling | forest-path, hero-mountain, lake-mountain + video-2 |
| Team | Team introduction | character (4x) |
| Partners | Trust building | Testimonials |
| Donate | Fundraising | mountain-peak |
| News | Updates | download2-4 |
| Contact | Lead generation | Form only |

## 🎨 Design Inspiration

Based on award-winning websites from [Awwwards](https://www.awwwards.com/):
- Minimal, elegant layouts
- Generous white space
- Asymmetric compositions
- Smooth, purposeful animations
- Strong typography hierarchy
- Subtle color palettes
- Premium feel without being overwhelming

## 💡 Future Enhancements

- Add CMS integration for content management
- Implement real form submissions
- Add blog functionality
- Create admin dashboard
- Integrate payment gateway for donations
- Add multi-language support
- Implement advanced analytics

