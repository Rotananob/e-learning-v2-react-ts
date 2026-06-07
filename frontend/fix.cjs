const fs = require('fs');
let c = fs.readFileSync('src/data/coursesData.ts', 'utf8');
c = c.replace(/icon:<i className="([^"]+)"\/>/g, 'icon: "$1"');
fs.writeFileSync('src/data/coursesData.ts', c);
