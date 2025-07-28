import express from 'express';
import { Class } from '../models/Class';
import News from '../models/News';
import Newsletter from '../models/Newsletter';
import { User } from '../models/User';
import { startOfMonth, endOfMonth, subMonths } from 'date-fns';
import os from 'os';
import { exec } from 'child_process';
import { promisify } from 'util';
import { memoryManager } from '../utils/memoryManager';

const execAsync = promisify(exec);

// اضافه کردن event listeners برای مدیریت حافظه
memoryManager.on('memoryLeak', (stats) => {
  console.error('Memory leak detected:', stats);
  // ارسال اعلان به مدیر سیستم
});

memoryManager.on('highMemoryUsage', (stats) => {
  console.warn('High memory usage detected:', stats);
  // ارسال اعلان به مدیر سیستم
});

memoryManager.on('emergencyCleanup', (stats) => {
  console.log('Emergency cleanup performed:', stats);
  // ارسال اعلان به مدیر سیستم
});

// تعریف interface‌ها برای type safety
interface RecentClass {
  _id?: string;
  title: string;
  teacher: string;
  startDate: string;
}

interface RecentNews {
  _id?: string;
  title: string;
  createdAt: string;
}

async function getSystemStatus() {
  try {
    console.log('Starting project-specific system status check...')
    
    // دریافت اطلاعات CPU پروژه
    let cpuUsage = 0
    try {
      if (process.platform === 'win32') {
        console.log('Running on Windows, checking process CPU usage...')
        const { stdout } = await execAsync(`wmic process where "name='node.exe'" get WorkingSetSize,ProcessId /format:list`)
        console.log('Windows Process Info:', stdout)
        
        // محاسبه مجموع حافظه استفاده شده توسط تمام پردازش‌های node
        const processLines = stdout.split('\n')
        let totalProcessMemory = 0
        let processCount = 0
        for (const line of processLines) {
          if (line.includes('WorkingSetSize=')) {
            const memory = parseInt(line.split('=')[1].trim())
            if (!isNaN(memory)) {
              totalProcessMemory += memory
              processCount++
            }
          }
        }
        
        // محاسبه درصد CPU بر اساس حافظه استفاده شده
        const totalSystemMemory = os.totalmem()
        cpuUsage = (totalProcessMemory / totalSystemMemory) * 100
        
        console.log('Process Memory Usage:', {
          totalProcessMemory: `${Math.round(totalProcessMemory / (1024 * 1024))}MB`,
          totalSystemMemory: `${Math.round(totalSystemMemory / (1024 * 1024 * 1024))}GB`,
          processCount,
          calculatedUsage: cpuUsage
        })
      } else {
        const { stdout } = await execAsync('ps -p $PPID -o %cpu')
        const lines = stdout.trim().split('\n')
        if (lines.length > 1) {
          const usage = parseFloat(lines[1].trim())
          if (!isNaN(usage)) {
            cpuUsage = usage
          }
        }
      }
    } catch (cpuError) {
      console.error('Error getting process CPU info:', cpuError)
      cpuUsage = 0
    }

    // دریافت اطلاعات حافظه پروژه با استفاده از memoryManager
    const memoryStats = memoryManager.getStats()
    const totalSystemMemory = os.totalmem()
    const usedMemory = memoryStats.memoryUsage.rss // استفاده از RSS به جای heapUsed
    const memoryUsage = (usedMemory / totalSystemMemory) * 100
    
    console.log('Detailed Memory Usage:', {
      rss: `${Math.round(memoryStats.memoryUsage.rss / (1024 * 1024))}MB`,
      heapTotal: `${Math.round(memoryStats.memoryUsage.heapTotal / (1024 * 1024))}MB`,
      heapUsed: `${Math.round(memoryStats.memoryUsage.heapUsed / (1024 * 1024))}MB`,
      external: `${Math.round(memoryStats.memoryUsage.external / (1024 * 1024))}MB`,
      arrayBuffers: `${Math.round(memoryStats.memoryUsage.arrayBuffers / (1024 * 1024))}MB`,
      cacheSize: memoryStats.cacheSize,
      maxCacheSize: memoryStats.maxCacheSize,
      memoryLeakDetected: memoryStats.memoryLeakDetected,
      totalSystemMemory: `${Math.round(totalSystemMemory / (1024 * 1024 * 1024))}GB`,
      usedMemory: `${Math.round(usedMemory / (1024 * 1024))}MB`,
      calculatedUsage: memoryUsage
    })

    // اگر memory leak تشخیص داده شده، cleanup اضطراری انجام شود
    if (memoryStats.memoryLeakDetected) {
      await memoryManager.cleanup()
    }

    // دریافت اطلاعات فضای ذخیره‌سازی پروژه
    let storageUsage = 0
    try {
      const projectPath = process.cwd()
      console.log('Checking project storage at:', projectPath)
      
      if (process.platform === 'win32') {
        const { stdout } = await execAsync(`powershell -command "Get-ChildItem -Path '${projectPath}' -Recurse -File | Measure-Object -Property Length -Sum"`)
        console.log('Windows Project Storage Info:', stdout)
        
        const match = stdout.match(/Sum\s*:\s*(\d+)/)
        if (match) {
          const totalSize = parseInt(match[1])
          const totalSpace = os.totalmem()
          storageUsage = (totalSize / totalSpace) * 100
          
          console.log('Project Storage Calculation:', {
            totalSize: `${Math.round(totalSize / (1024 * 1024))}MB`,
            totalSpace: `${Math.round(totalSpace / (1024 * 1024 * 1024))}GB`,
            calculatedUsage: storageUsage
          })
        } else {
          console.warn('Could not parse PowerShell output:', stdout)
        }
      } else {
        const { stdout } = await execAsync(`du -sh "${projectPath}"`)
        console.log('Linux Project Storage Info:', stdout)
        
        const match = stdout.match(/^(\d+[KMG])/)
        if (match) {
          const size = match[1]
          const sizeInBytes = parseSize(size)
          const totalSpace = os.totalmem()
          storageUsage = (sizeInBytes / totalSpace) * 100
          
          console.log('Project Storage Calculation:', {
            size,
            totalSpace: `${Math.round(totalSpace / (1024 * 1024 * 1024))}GB`,
            calculatedUsage: storageUsage
          })
        }
      }
    } catch (storageError) {
      console.error('Error getting project storage info:', storageError)
      storageUsage = 0
    }

    // اطمینان از اینکه مقادیر در محدوده معتبر هستند
    const clampValue = (value: number) => Math.min(Math.max(value, 0), 100)

    const finalCpuUsage = clampValue(cpuUsage)
    const finalMemoryUsage = clampValue(memoryUsage)
    const finalStorageUsage = clampValue(storageUsage)

    console.log('Final Project Usage Values:', {
      cpu: finalCpuUsage,
      memory: finalMemoryUsage,
      storage: finalStorageUsage,
      memoryLeakDetected: memoryStats.memoryLeakDetected
    })

    const finalValues = {
      cpu: `${Math.round(finalCpuUsage)}%`,
      memory: `${Math.round(finalMemoryUsage)}%`,
      storage: `${Math.round(finalStorageUsage)}%`,
      memoryLeakDetected: memoryStats.memoryLeakDetected
    }

    console.log('Final Project Status Values:', finalValues)
    return finalValues
  } catch (error) {
    console.error('Error getting project system status:', error)
    return {
      cpu: '0%',
      memory: '0%',
      storage: '0%',
      memoryLeakDetected: false
    }
  }
}

// تابع کمکی برای تبدیل اندازه‌های مختلف به بایت
function parseSize(size: string): number {
  const units: { [key: string]: number } = {
    'K': 1024,
    'M': 1024 * 1024,
    'G': 1024 * 1024 * 1024
  }
  
  const match = size.match(/^(\d+)([KMG])$/)
  if (match) {
    const [, value, unit] = match
    return parseInt(value) * units[unit]
  }
  return 0
}

const router = express.Router();

router.get('/stats', async (req, res) => {
  try {
    console.log('Fetching dashboard stats...')
    
    // استفاده از cache برای آمار داشبورد
    const cacheKey = 'dashboard_stats'
    
    // اگر پارامتر refresh ارسال شده باشد، cache را پاک می‌کنیم
    if (req.query.refresh === 'true') {
      memoryManager.delete(cacheKey)
      console.log('Cache cleared for dashboard stats')
    }
    
    const cachedStats = memoryManager.get(cacheKey)
    
    if (cachedStats) {
      console.log('Returning cached dashboard stats')
      return res.json(cachedStats)
    }
    
    // محاسبه وضعیت سیستم به صورت جداگانه
    console.log('Calculating system status...')
    const systemStatus = await getSystemStatus()
    console.log('System status calculated:', systemStatus)
    
    // دریافت اطلاعات کاربران برای بررسی
    const allUsers = await User.find({}, { role: 1, createdAt: 1 });
    console.log('All users:', allUsers.map(u => ({
      role: u.role,
      createdAt: u.createdAt
    })));
    
    const [
      totalClasses,
      totalNewsletters,
      recentClasses,
      recentNews,
      totalNews,
      totalActiveNews,
      totalActiveClasses,
      totalActiveNewsletters,
      activeUsers
    ] = await Promise.all([
      Class.countDocuments(),
      Newsletter.countDocuments(),
      Class.find({ isActive: true })
        .sort({ startDate: -1 })
        .limit(5)
        .select('title teacher startDate')
        .lean(),
      News.find({ status: 'published' })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('title createdAt')
        .lean(),
      News.countDocuments(),
      News.countDocuments({ status: 'published' }),
      Class.countDocuments({ isActive: true }),
      Newsletter.countDocuments({ active: true }),
      User.countDocuments({ role: { $in: ['admin', 'student', 'parent', 'user'] } })
    ]);

    console.log('Dashboard Stats:', {
      totalClasses,
      totalNewsletters,
      totalNews,
      totalActiveNews,
      totalActiveClasses,
      totalActiveNewsletters,
      activeUsers,
      systemStatus
    });

    const response = {
      totalClasses,
      totalNewsletters,
      recentClasses: recentClasses.map((cls: any) => ({
        id: cls._id?.toString(),
        title: cls.title,
        teacher: cls.teacher,
        startDate: cls.startDate
      })),
      recentNews: recentNews.map((news: any) => ({
        id: news._id?.toString(),
        title: news.title,
        createdAt: news.createdAt?.toString()
      })),
      totalNews,
      totalActiveNews,
      totalActiveClasses,
      totalActiveNewsletters,
      activeUsers,
      systemStatus
    };

    // ذخیره در cache برای 5 دقیقه
    memoryManager.set(cacheKey, response, 5 * 60 * 1000)

    console.log('Sending response with system status:', JSON.stringify(response, null, 2))
    res.json(response);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({ error: 'خطا در دریافت آمار داشبورد' });
  }
});

router.get('/newsletter-history', async (req, res) => {
  try {
    const cacheKey = 'newsletter_history'
    const cachedHistory = memoryManager.get(cacheKey)
    
    if (cachedHistory) {
      console.log('Returning cached newsletter history')
      return res.json(cachedHistory)
    }

    // دریافت آمار 6 ماه اخیر
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i);
      return {
        start: startOfMonth(date),
        end: endOfMonth(date),
        label: date.toLocaleDateString('fa-IR', { year: 'numeric', month: 'long' })
      };
    }).reverse();

    const stats = await Promise.all(
      months.map(async ({ start, end, label }) => {
        const total = await Newsletter.countDocuments({
          createdAt: { $gte: start, $lte: end }
        });
        const active = await Newsletter.countDocuments({
          createdAt: { $gte: start, $lte: end },
          active: true
        });
        return {
          label,
          total,
          active
        };
      })
    );

    // ذخیره در cache برای 5 دقیقه
    memoryManager.set(cacheKey, stats, 5 * 60 * 1000)

    res.json(stats);
  } catch (error) {
    console.error('Error fetching newsletter history:', error);
    res.status(500).json({ error: 'خطا در دریافت تاریخچه خبرنامه' });
  }
});

export default router; 