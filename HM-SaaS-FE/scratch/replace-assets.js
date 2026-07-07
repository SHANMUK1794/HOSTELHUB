import fs from "fs";
import path from "path";

const baseDir = "c:/Users/SHANMUK CHOWDARY/Desktop/TJ_HostelManagement/HM-SaaS-FE/src";

const imageMappers = {
  "chef.png": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 18h12a2 2 0 0 0 2-2v-5H4v5a2 2 0 0 0 2 2z'/><path d='M2 11h20'/><path d='M12 2v6'/><circle cx='12' cy='2' r='1'/></svg>",
  "breakfast.png": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2'><circle cx='12' cy='12' r='10'/><path d='M12 2v20M2 12h20'/></svg>",
  "lunch.png": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2'><circle cx='12' cy='12' r='10'/><path d='M12 2v20M2 12h20'/></svg>",
  "dinner.png": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2'><circle cx='12' cy='12' r='10'/><path d='M12 2v20M2 12h20'/></svg>",
  "upload_illustration.png": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12'/></svg>",
  "telephoneIcon.png": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z'/></svg>",
  "idIcon.png": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><rect x='3' y='4' width='18' height='16' rx='2'/><path d='M7 9h10M7 13h10M7 17h6'/></svg>",
  "recycle.png": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67'/></svg>",
  "delete.png": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dc2626' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M19 7l-.867 12.142A2 2 0 0 1 16.138 21H7.862a2 2 0 0 1-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v3M4 7h16'/></svg>",
  "flags.png": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M4 15s1-1 4-1 5 2 8 2 4-1 4-1V3s-1 1-4 1-5-2-8-2-4 1-4 1zM4 22v-7'/></svg>",
  "baloon.png": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 12a5 5 0 1 0 0-10 5 5 0 0 0 0 10zm0 0v8'/></svg>",
  "plusicon.png": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><line x1='12' y1='5' x2='12' y2='19'/><line x1='5' y1='12' x2='19' y2='12'/></svg>",
  "Birthday-reminders.png": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M20 21v-8a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v8'/><path d='M4 16h16'/><path d='M10 9V5a2 2 0 0 1 4 0v4'/><circle cx='12' cy='3' r='1'/></svg>",
  "Complaints.png": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2'/><rect x='8' y='2' width='8' height='4' rx='1' ry='1'/><path d='M9 14h6'/><path d='M9 18h6'/><path d='M9 10h3'/></svg>",
  "Certificates.png": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z'/><path d='M12 8v4'/><path d='M12 16h.01'/></svg>",
  "FoodandKitchen.jpg": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 18h12a2 2 0 0 0 2-2v-5H4v5a2 2 0 0 0 2 2z'/><path d='M2 11h20'/><path d='M12 2v6'/><circle cx='12' cy='2' r='1'/></svg>",
  "KitchenMenu.jpg": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 18h12a2 2 0 0 0 2-2v-5H4v5a2 2 0 0 0 2 2z'/><path d='M2 11h20'/><path d='M12 2v6'/><circle cx='12' cy='2' r='1'/></svg>",
  "KitchenExpance.png": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 18h12a2 2 0 0 0 2-2v-5H4v5a2 2 0 0 0 2 2z'/><path d='M2 11h20'/><path d='M12 2v6'/><circle cx='12' cy='2' r='1'/></svg>",
  "kitcheninventory.jpg": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 18h12a2 2 0 0 0 2-2v-5H4v5a2 2 0 0 0 2 2z'/><path d='M2 11h20'/><path d='M12 2v6'/><circle cx='12' cy='2' r='1'/></svg>",
  "GasandCylinder.jpg": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><path d='M6 18h12a2 2 0 0 0 2-2v-5H4v5a2 2 0 0 0 2 2z'/><path d='M2 11h20'/><path d='M12 2v6'/><circle cx='12' cy='2' r='1'/></svg>",
  "vegicon.svg": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%2316a34a' stroke-width='2' className='w-5 h-5'><rect x='3' y='3' width='18' height='18' rx='2' ry='2'/><circle cx='12' cy='12' r='5' fill='%2316a34a'/></svg>",
  "nonvegicon.svg": "data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%23dc2626' stroke-width='2' className='w-5 h-5'><rect x='3' y='3' width='18' height='18' rx='2' ry='2'/><polygon points='12,7 17,16 7,16' fill='%23dc2626'/></svg>"
};

function walkDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      walkDir(fullPath);
    } else if (file.endsWith(".jsx") || file.endsWith(".js")) {
      let content = fs.readFileSync(fullPath, "utf8");
      let changed = false;

      // Replace any techjose CDN asset URL with mapped vector SVG or fallback
      if (content.includes("https://asset.techjose.com")) {
        content = content.replace(/["']https:\/\/asset\.techjose\.com\/[^"']+["']/g, (match) => {
          // Extract base filename (e.g. chef.png)
          const basename = match.split("/").pop().replace(/["']/g, "");
          if (imageMappers[basename]) {
            return `"${imageMappers[basename]}"`;
          }
          // Fallback placeholder SVG
          return `"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24' fill='none' stroke='%230d9488' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'><circle cx='12' cy='12' r='10'/><path d='M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3M12 17h.01'/></svg>"`;
        });
        changed = true;
      }

      if (changed) {
        fs.writeFileSync(fullPath, content, "utf8");
        console.log(`Rewrote techjose asset links in: ${fullPath}`);
      }
    }
  }
}

walkDir(baseDir);
console.log("Replacement complete!");
