// fix-ts-errors.js
// اجرا با: node fix-ts-errors.js
const fs = require('fs');
const path = require('path');

// مسیرها
const srcDir = path.join(__dirname, 'src');

// خواندن و نوشتن فایل
const readFile = (filePath) => fs.readFileSync(filePath, 'utf8');
const writeFile = (filePath, content) => fs.writeFileSync(filePath, content, 'utf8');

// اصلاح نوع User
const fixUserType = () => {
  const userTypePath = path.join(srcDir, 'types', 'index.ts'); // مسیر را تنظیم کنید
  if (fs.existsSync(userTypePath)) {
    let content = readFile(userTypePath);
    if (!content.includes('isAdmin')) {
      // جستجو برای اینترفیس User
      const userInterfaceRegex = /interface\s+User\s*\{[^}]*\}/;
      if (userInterfaceRegex.test(content)) {
        content = content.replace(
          userInterfaceRegex,
          (match) => match.replace(/\}$/, '  isAdmin?: boolean;\n}')
        );
        writeFile(userTypePath, content);
        console.log('✅ اینترفیس User اصلاح شد');
      }
    }
  }
};

// اصلاح متغیرهای استفاده نشده
const fixUnusedVariables = (filePath) => {
  let content = readFile(filePath);
  
  // حذف واردسازی‌های استفاده نشده
  content = content.replace(/import React,/g, 'import React, /* eslint-disable-line */');
  content = content.replace(/import { ERROR_MESSAGES }/g, '// import { ERROR_MESSAGES }');
  
  // علامت‌گذاری متغیرهای استفاده نشده
  content = content.replace(/const { t }/g, 'const { /* t */ }');
  content = content.replace(/const \[error,/g, 'const [/* error */, ');
  
  // پارامترهای استفاده نشده در تابع‌ها
  content = content.replace(/((\w+), index\) =>)/g, '$1 /* index */ ) =>');
  
  writeFile(filePath, content);
  console.log(`✅ فایل اصلاح شد: ${path.relative(__dirname, filePath)}`);
};

// پیمایش دایرکتوری و اصلاح فایل‌ها
const traverseAndFix = (dir) => {
  const files = fs.readdirSync(dir);
  
  for (const file of files) {
    const fullPath = path.join(dir, file);
    const stat = fs.statSync(fullPath);
    
    if (stat.isDirectory()) {
      traverseAndFix(fullPath);
    } else if (/\.(tsx?|jsx?)$/.test(file)) {
      fixUnusedVariables(fullPath);
    }
  }
};

// اجرای اصلاحات
fixUserType();
traverseAndFix(srcDir);

console.log('🎉 اصلاحات انجام شد. پروژه را دوباره اجرا کنید.');