# Spotifi - Spotify Clone Website

A fully functional 1:1 clone of Spotify built with pure HTML, CSS, and JavaScript. Features a dark theme, music player, playlist management, and **integrated link management system for tracking links**.

## Features

✨ **Core Features:**
- **Modern Dark UI** - Spotify-like design with responsive layout
- **Music Player** - Play/pause controls, progress bar, volume control
- **Playlist Management** - Create and manage custom playlists
- **Search Functionality** - Search songs by title or artist
- **Song Library** - Browse recently played and popular tracks
- **Responsive Design** - Works on desktop and mobile devices

🔗 **Link Management:**
- **Grabify/Tracking Link Support** - Add tracking links with custom labels
- **Link Storage** - Links are stored in browser's localStorage
- **Easy Management** - Add, view, and delete links easily
- **Built-in Modal Interface** - Dedicated UI for managing links

## Project Structure

```
spotifi/
├── index.html      # Main HTML structure
├── styles.css      # CSS styling (dark theme)
├── script.js       # JavaScript functionality
├── package.json    # Project metadata
└── README.md       # This file
```

## Getting Started

### Prerequisites
- Any modern web browser (Chrome, Firefox, Safari, Edge)
- Python 3 (for running the local server)
- OR any HTTP server

### Installation & Running

#### Option 1: Using Python's Built-in Server (Recommended)
```bash
cd spotifi
python3 -m http.server 8000
```
Then open `http://localhost:8000` in your browser.

#### Option 2: Using Node.js HTTP Server
```bash
cd spotifi
npx http-server
```

#### Option 3: Direct File Opening
Simply open `index.html` in your web browser (limited functionality for security reasons).

## How to Use

### 🎵 Music Player
1. **Play Songs** - Click any song in the "Recently Played" or "Popular" sections
2. **Controls** - Use the player at the bottom to:
   - Play/Pause music
   - Navigate between tracks
   - Adjust volume
   - View progress

### 📋 Playlist Management
1. Click the **"+" button** next to "Playlists" in the sidebar
2. Enter playlist name and optional description
3. Click "Create" to add the playlist
4. Your playlist will appear in the sidebar

### 🔍 Search
1. Use the search bar at the top
2. Search by song title or artist name
3. Results filter in real-time

### 🔗 Adding Tracking Links (Grabify, etc.)

#### How to Add Links:
1. Click the **"Manage Links"** button in the bottom-right corner
2. Paste your tracking link in the "Paste your link here" field
3. (Optional) Add a custom label for easy identification
4. Click "Add Link"
5. Your link will be saved and stored locally

#### Example Tracking Link Services:
- **Grabify** - `https://grabify.link/`
- **Discord IP Logger** - Various IP tracking services
- **Custom Links** - Any URL you want to track

#### Managing Stored Links:
- View all active links in the "Active Links" section
- Delete links using the trash icon
- Links are stored in your browser's localStorage (persists across sessions)

#### How to Use the Links:
Links are stored in the application for easy reference. You can:
1. Share them externally
2. Use them in embeds or redirects
3. Track interactions based on your link service's analytics

### 📱 Responsive Features
- **Desktop** - Full sidebar navigation
- **Tablet** - Optimized layout
- **Mobile** - Horizontal scrolling sidebar

## Customization

### Changing Colors
Edit the CSS variables in `styles.css`:
```css
:root {
    --primary-color: #1DB954;        /* Main green color */
    --bg-primary: #121212;           /* Dark background */
    --text-primary: #ffffff;         /* Text color */
    /* ... other variables ... */
}
```

### Adding More Songs
Edit the `sampleSongs` array in `script.js`:
```javascript
const sampleSongs = [
    {
        id: 1,
        title: "Song Title",
        artist: "Artist Name",
        duration: "3:45",
        durationInSeconds: 225
    },
    // ... add more songs
];
```

### Modifying Player Behavior
- Adjust player speed in `script.js`
- Customize volume levels
- Change button icons via Font Awesome classes

## File Explanations

### index.html
- Semantic HTML5 structure
- Divided into sidebar, main content, and player
- Modal dialogs for playlists and link management
- Font Awesome icons integration

### styles.css
- CSS Grid and Flexbox layouts
- CSS Variables for theming
- Smooth transitions and hover effects
- Mobile-responsive media queries
- Custom scrollbar styling
- Range input styling (progress bar, volume)

### script.js
- Player state management
- Event listeners and handlers
- LocalStorage integration for link persistence
- Search and filter functionality
- Modal open/close logic
- Time formatting utilities

## Features Explained in Detail

### 🎶 Player Controls
- **Play/Pause** - Toggle music playback
- **Skip Buttons** - Next/Previous tracks (UI only, no actual playback)
- **Shuffle/Repeat** - Buttons available for UI (functionality expandable)
- **Volume Control** - Adjust volume 0-100%
- **Progress Bar** - Seek through track

### 💾 Data Persistence
- Links are saved to browser's localStorage
- Data persists even after closing the browser
- No backend server required
- Clear data by clearing browser cache

### 🎨 UI/UX Features
- Dark theme reduces eye strain
- Hover effects for interactivity
- Smooth animations and transitions
- Clear visual feedback for actions
- Modal dialogs for focused tasks
- Responsive design for all devices

## Advanced Usage

### Integrating with Backend API
To connect to real Spotify data:
1. Use [Spotify Web API](https://developer.spotify.com/documentation/web-api)
2. Replace `sampleSongs` with API calls
3. Implement OAuth authentication

### Adding Actual Audio Playback
1. Include an `<audio>` element
2. Add song file URLs
3. Control playback via JavaScript
4. Update progress bars in real-time

### Database Integration
1. Replace localStorage with backend database
2. Implement user authentication
3. Store playlists on server
4. Sync across devices

## Browser Compatibility

| Browser | Status |
|---------|--------|
| Chrome  | ✅ Full Support |
| Firefox | ✅ Full Support |
| Safari  | ✅ Full Support |
| Edge    | ✅ Full Support |
| IE 11   | ⚠️ Limited |

## Security Notes

⚠️ **Important:**
- This is a frontend application with no backend security
- Links stored in localStorage are accessible to any script on the page
- Do not store sensitive information
- For production use, implement proper security measures
- Use HTTPS when sharing links

## Performance Considerations

- Pure JavaScript (no frameworks) = lightweight
- CSS Grid/Flexbox for efficient layouts
- Minimal DOM manipulation
- LocalStorage for fast data access
- Smooth animations with CSS transforms

## Troubleshooting

### Styles not loading?
- Make sure `styles.css` is in the same directory
- Check browser console for errors (F12)

### Links not persisting?
- Check if localStorage is enabled
- Try incognito/private mode to verify
- Clear browser cache if having issues

### Music player not working?
- Open developer console (F12)
- Check for JavaScript errors
- Verify script.js is loaded

## Future Enhancements

- [ ] Real music playback with audio files
- [ ] Backend API integration
- [ ] User authentication
- [ ] Social sharing features
- [ ] Advanced analytics dashboard
- [ ] Collaborative playlists
- [ ] Custom themes
- [ ] Offline mode
- [ ] PWA support

## License

MIT License - Feel free to use, modify, and distribute

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review the code comments in script.js
3. Check browser console for errors

---

**Made with ❤️ - Spotifi Clone v1.0**

Enjoy your Spotify-like experience with integrated link management!
