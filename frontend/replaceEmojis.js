import fs from 'fs';
import path from 'path';

const emojiMap = {
  '🌐': '<i className="fa-solid fa-globe" />',
  '🐍': '<i className="fa-brands fa-python" />',
  '⚛️': '<i className="fa-brands fa-react" />',
  '🎮': '<i className="fa-solid fa-gamepad" />',
  '📱': '<i className="fa-solid fa-mobile-screen" />',
  '👤': '<i className="fa-solid fa-user" />',
  '⏳': '<i className="fa-solid fa-hourglass-half" />',
  '✅': '<i className="fa-solid fa-circle-check" />',
  '📚': '<i className="fa-solid fa-book" />',
  '⭐': '<i className="fa-solid fa-star" />',
  '🤖': '<i className="fa-solid fa-robot" />',
  '⚙️': '<i className="fa-solid fa-gear" />',
  '🏠': '<i className="fa-solid fa-house" />',
  '🚪': '<i className="fa-solid fa-right-from-bracket" />',
  '📊': '<i className="fa-solid fa-chart-pie" />',
  '🔍': '<i className="fa-solid fa-magnifying-glass" />',
  '🚫': '<i className="fa-solid fa-ban" />',
  '📌': '<i className="fa-solid fa-thumbtack" />',
  '📖': '<i className="fa-solid fa-book-open" />',
  '▶️': '<i className="fa-solid fa-circle-play" />',
  '▶': '<i className="fa-solid fa-play" />',
  '❌': '<i className="fa-solid fa-xmark" />',
  '🔒': '<i className="fa-solid fa-lock" />',
  '🥲': '<i className="fa-solid fa-face-sad-tear" />',
  '💾': '<i className="fa-solid fa-floppy-disk" />',
  '🎯': '<i className="fa-solid fa-bullseye" />',
  '👥': '<i className="fa-solid fa-users" />',
};

function walkDir(dir) {
  let files = [];
  fs.readdirSync(dir).forEach(file => {
    let fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      files = files.concat(walkDir(fullPath));
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      files.push(fullPath);
    }
  });
  return files;
}

const files = walkDir('./src');

files.forEach(file => {
  let content = fs.readFileSync(file, 'utf8');
  let original = content;
  
  for (const [emoji, icon] of Object.entries(emojiMap)) {
    // Escape emoji for regex if needed, or just use string replacement in a loop
    content = content.split(emoji).join(icon);
  }
  
  if (content !== original) {
    fs.writeFileSync(file, content, 'utf8');
    console.log('Updated:', file);
  }
});
