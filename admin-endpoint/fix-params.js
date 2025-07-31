const fs = require('fs');
const path = require('path');

// Function to fix params in a file
function fixParamsInFile(filePath) {
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    
    // Fix params type from { id: string } to Promise<{ id: string }>
    content = content.replace(
      /{ params }: \{ params: \{ id: string \} \}/g,
      '{ params }: { params: Promise<{ id: string }> }'
    );
    
    // Add await params destructuring after function declaration
    const functionRegex = /export async function (GET|POST|PUT|DELETE|PATCH)\s*\(\s*request: Request,\s*\{ params \}: \{ params: Promise<\{ id: string \}> \}\s*\)\s*\{/g;
    content = content.replace(functionRegex, (match, method) => {
      return `${match}\n  const { id } = await params;`;
    });
    
    // Replace params.id with id
    content = content.replace(/params\.id/g, 'id');
    
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Fixed: ${filePath}`);
  } catch (error) {
    console.error(`Error fixing ${filePath}:`, error.message);
  }
}

// Function to recursively find and fix all API route files
function fixAllApiRoutes(dir) {
  const files = fs.readdirSync(dir);
  
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      fixAllApiRoutes(filePath);
    } else if (file === 'route.ts' && filePath.includes('src/app/api')) {
      fixParamsInFile(filePath);
    }
  });
}

// Start fixing from src/app/api directory
const apiDir = path.join(__dirname, 'src', 'app', 'api');
if (fs.existsSync(apiDir)) {
  console.log('Fixing API route params for Next.js 15.3.0...');
  fixAllApiRoutes(apiDir);
  console.log('Done!');
} else {
  console.log('API directory not found');
} 