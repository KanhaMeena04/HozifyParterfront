const fs = require('fs');
const path = require('path');

const srcDir = path.join(__dirname, 'src');

function processDir(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      processFile(fullPath);
    }
  }
}

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let changed = false;

  // 1. Replace empty onPress
  if (content.includes('onPress={() => {}}')) {
    content = content.replace(/onPress=\{\(\) => \{\}\}/g, "onPress={() => router.push('/(dashboard)/coming-soon')}");
    changed = true;
  }

  // 2. Replace useRouter with useSafeRouter
  if (content.includes("import { useRouter } from 'expo-router';")) {
    content = content.replace("import { useRouter } from 'expo-router';", "import { useSafeRouter } from '@/hooks/useSafeRouter';");
    content = content.replace(/const router = useRouter\(\);/g, "const router = useSafeRouter();");
    changed = true;
  } else if (content.match(/import\s+\{([^}]*)useRouter([^}]*)\}\s+from\s+['"]expo-router['"];/)) {
    // If imported along with other things from expo-router
    content = content.replace(/useRouter\s*,?/, '');
    // Insert new import
    content = `import { useSafeRouter } from '@/hooks/useSafeRouter';\n` + content;
    content = content.replace(/const router = useRouter\(\);/g, "const router = useSafeRouter();");
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(filePath, content, 'utf8');
    console.log(`Updated: ${filePath}`);
  }
}

processDir(srcDir);
