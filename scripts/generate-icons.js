import sharp from 'sharp';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs/promises';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const sizes = [16, 32, 192, 512];
const inputFile = path.join(__dirname, '../public/icon.svg');
const outputDir = path.join(__dirname, '../public');

async function generateIcons() {
  for (const size of sizes) {
    const outputFile = path.join(outputDir, size <= 32 ? 'favicon.ico' : `icon-${size}x${size}.png`);
    
    try {
      if (size <= 32) {
        // Generate ICO file for favicon
        await sharp(inputFile)
          .resize(size, size)
          .toFile(path.join(outputDir, `favicon-${size}.png`));
        
        // Convert to ICO format (you might need to install additional tools for this)
        // For now, we'll just use the PNG as favicon
        await sharp(path.join(outputDir, `favicon-${size}.png`))
          .toFile(outputFile);
          
        // Clean up temporary PNG
        await fs.unlink(path.join(outputDir, `favicon-${size}.png`));
      } else {
        // Generate PNG icons for PWA
        await sharp(inputFile)
          .resize(size, size)
          .png()
          .toFile(outputFile);
      }
      console.log(`Generated ${size}x${size} icon`);
    } catch (error) {
      console.error(`Error generating ${size}x${size} icon:`, error);
    }
  }
}

generateIcons(); 