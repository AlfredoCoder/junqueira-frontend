import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Corrigindo template strings malformadas...');

// Função para buscar arquivos recursivamente
function findFiles(dir, extensions = ['.tsx', '.ts', '.js', '.jsx']) {
  const files = [];
  
  function searchDir(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory()) {
        // Pular node_modules e .next
        if (!item.startsWith('.') && item !== 'node_modules') {
          searchDir(fullPath);
        }
      } else if (extensions.some(ext => item.endsWith(ext))) {
        files.push(fullPath);
      }
    }
  }
  
  searchDir(dir);
  return files;
}

// Buscar todos os arquivos TypeScript/JavaScript
const srcDir = path.join(__dirname, 'src');
const files = findFiles(srcDir);

let totalFiles = 0;
let totalReplacements = 0;

console.log(`📁 Encontrados ${files.length} arquivos para verificar...`);

files.forEach(filePath => {
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    
    // Padrões para corrigir template strings malformadas
    const patterns = [
      {
        // '${process.env.NEXT_PUBLIC_API_URL}/path' → `${process.env.NEXT_PUBLIC_API_URL}/path`
        from: /'(\$\{process\.env\.NEXT_PUBLIC_API_URL\}[^']*?)'/g,
        to: '`$1`',
        description: 'Template strings com aspas simples'
      },
      {
        // "${process.env.NEXT_PUBLIC_API_URL}/path" → `${process.env.NEXT_PUBLIC_API_URL}/path`
        from: /"(\$\{process\.env\.NEXT_PUBLIC_API_URL\}[^"]*?)"/g,
        to: '`$1`',
        description: 'Template strings com aspas duplas'
      }
    ];
    
    let newContent = content;
    let fileChanged = false;
    let fileReplacements = 0;
    
    patterns.forEach(pattern => {
      const matches = newContent.match(pattern.from);
      if (matches) {
        newContent = newContent.replace(pattern.from, pattern.to);
        fileReplacements += matches.length;
        fileChanged = true;
      }
    });
    
    if (fileChanged) {
      fs.writeFileSync(filePath, newContent);
      console.log(`✅ ${path.relative(__dirname, filePath)} - ${fileReplacements} correções`);
      totalFiles++;
      totalReplacements += fileReplacements;
    }
    
  } catch (error) {
    console.error(`❌ Erro ao processar ${filePath}:`, error.message);
  }
});

console.log('\n📊 RESUMO:');
console.log(`✅ Arquivos corrigidos: ${totalFiles}`);
console.log(`🔄 Total de correções: ${totalReplacements}`);

if (totalReplacements > 0) {
  console.log('\n🎯 CORREÇÕES APLICADAS:');
  console.log("- '${process.env.NEXT_PUBLIC_API_URL}/path' → `${process.env.NEXT_PUBLIC_API_URL}/path`");
  console.log('- Template strings agora funcionam corretamente');
  console.log('\n✅ Todas as URLs agora interpolam a variável de ambiente!');
} else {
  console.log('\n✅ Nenhuma template string malformada encontrada!');
}
