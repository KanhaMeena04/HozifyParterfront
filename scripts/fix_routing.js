const fs = require('fs');
const path = require('path');

const APP_DIR = path.join(__dirname, '..', 'src', 'app');

const mandatoryFlowPages = [
  'business/index.tsx', // Business Profile
  'kyc/upload.tsx', // KYC Upload
  'business/upload.tsx', // Business Document Upload
  'branch/create.tsx', // Branch Creation
  'services/select.tsx', // Partner Service Selection
  'services/index.tsx', // Service selection list
  'mapping.tsx', // Service Branch Mapping
  'employee/index.tsx', // Branch Employee Mapping
  'branch/index.tsx', // Might be branch mapping
  'add-employee.tsx', // Adding Employee
  'service-area.tsx', // Partner Service Area Creation
  'terms.tsx', // Terms & Conditions
  'policies.tsx', // Policies
];

function getAllTsxFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(getAllTsxFiles(filePath));
    } else if (filePath.endsWith('.tsx') && !file.startsWith('_layout')) {
      results.push(filePath);
    }
  });
  return results;
}

const allFiles = getAllTsxFiles(APP_DIR);

let modifiedCount = 0;

for (const filePath of allFiles) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;
  
  // Normalize path for comparison
  const relativePath = path.relative(path.join(APP_DIR, '(tabs)'), filePath).replace(/\\/g, '/');
  
  const isMandatory = mandatoryFlowPages.some(p => relativePath.endsWith(p));
  
  // 1. Add useAndroidBack import if not present
  if (!content.includes('useAndroidBack')) {
    // Find the last import statement
    const lastImportIndex = content.lastIndexOf('import ');
    if (lastImportIndex !== -1) {
      const endOfLastImport = content.indexOf('\n', lastImportIndex);
      content = content.slice(0, endOfLastImport + 1) + "import { useAndroidBack } from '@/hooks/useAndroidBack';\n" + content.slice(endOfLastImport + 1);
    }
  }

  // 2. Inject hook call into component
  // Find the export default function ...
  const functionRegex = /export\s+default\s+function\s+([a-zA-Z0-9_]+)\s*\([^)]*\)\s*\{/g;
  const match = functionRegex.exec(content);
  
  if (match) {
    const componentName = match[1];
    const openBraceIndex = match.index + match[0].length;
    
    // Check if the hook is already injected inside the function
    if (!content.substring(openBraceIndex, openBraceIndex + 200).includes('useAndroidBack(')) {
      let hookCall = `\n  useAndroidBack();`;
      if (isMandatory) {
        // Also ensure router is imported or available, it's usually there.
        // Wait, if we use router.replace, we need router in the hook call. But the hook itself uses useRouter!
        // So we can just pass a function: useAndroidBack(() => router.replace('/application-status'))
        hookCall = `\n  const router = useRouter();\n  useAndroidBack(() => router.replace('/application-status'));`;
        
        // Remove existing const router = useRouter() if we inject it, or just use existing.
        // Let's just rely on the existing router if it exists.
        if (content.includes('const router = useRouter()')) {
          hookCall = `\n  useAndroidBack(() => router.replace('/application-status'));`;
        }
      }
      
      content = content.slice(0, openBraceIndex) + hookCall + content.slice(openBraceIndex);
    }
  }
  
  // 3. For mandatory flow pages, replace router.back() with router.replace('/application-status') in UI
  if (isMandatory) {
    content = content.replace(/router\.back\(\)/g, "router.replace('/application-status')");
  }

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content);
    modifiedCount++;
  }
}

console.log(`Successfully updated ${modifiedCount} files.`);
