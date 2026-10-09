import fs from 'fs';
import path from 'path';
import { transformSync } from 'esbuild';

const walk = (dir) => {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      walk(fullPath);
    } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
      if (fullPath.endsWith('types.ts')) {
         fs.unlinkSync(fullPath);
         continue;
      }
      const isTsx = fullPath.endsWith('.tsx');
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Remove export types logic (esbuild usually strips it, but doing it manually is safe too)
      const out = transformSync(content, {
        loader: isTsx ? 'tsx' : 'ts',
        jsx: 'preserve',
        target: 'esnext',
      });
      
      const newPath = fullPath.replace(/\.tsx?$/, isTsx ? '.jsx' : '.js');
      fs.writeFileSync(newPath, out.code);
      fs.unlinkSync(fullPath);
      console.log(`Transpiled ${file}`);
    }
  }
}

walk('d:\\\\S055 Aryan Sutariya\\\\WalkAround\\\\walkaround\\\\src');
console.log('Transpilation complete!');
