import { EventEmitter } from 'events';
import { exec } from 'child_process';
import { promisify } from 'util';
import os from 'os';

const execAsync = promisify(exec);

class MemoryManager extends EventEmitter {
  private static instance: MemoryManager;
  private cache: Map<string, any>;
  private readonly MAX_CACHE_SIZE: number = 100; // کاهش سایز کش
  private readonly CLEANUP_INTERVAL: number = 2 * 60 * 1000; // 2 minutes
  private readonly MEMORY_CHECK_INTERVAL: number = 30 * 1000; // 30 seconds
  private readonly MEMORY_THRESHOLD: number = 0.7; // 70% threshold
  private lastMemoryUsage: NodeJS.MemoryUsage | null = null;
  private memoryLeakDetected: boolean = false;
  private readonly TOTAL_SYSTEM_MEMORY: number = os.totalmem();

  private constructor() {
    super();
    this.cache = new Map();
    this.startCleanupInterval();
    this.startMemoryMonitoring();
  }

  public static getInstance(): MemoryManager {
    if (!MemoryManager.instance) {
      MemoryManager.instance = new MemoryManager();
    }
    return MemoryManager.instance;
  }

  private startCleanupInterval(): void {
    setInterval(() => {
      this.cleanup();
    }, this.CLEANUP_INTERVAL);
  }

  private async startMemoryMonitoring(): Promise<void> {
    setInterval(async () => {
      await this.checkMemoryUsage();
    }, this.MEMORY_CHECK_INTERVAL);
  }

  private async checkMemoryUsage(): Promise<void> {
    const currentUsage = process.memoryUsage();
    
    if (this.lastMemoryUsage) {
      const heapGrowth = currentUsage.heapUsed - this.lastMemoryUsage.heapUsed;
      const heapGrowthRate = heapGrowth / this.lastMemoryUsage.heapUsed;
      
      // بررسی رشد غیرعادی حافظه
      if (heapGrowthRate > 0.1) { // رشد بیش از 10%
        console.warn('Potential memory leak detected:', {
          heapGrowth: `${Math.round(heapGrowth / (1024 * 1024))}MB`,
          growthRate: `${(heapGrowthRate * 100).toFixed(2)}%`,
          timestamp: new Date().toISOString()
        });
        
        this.memoryLeakDetected = true;
        this.emit('memoryLeak', {
          heapGrowth,
          growthRate: heapGrowthRate,
          timestamp: new Date().toISOString()
        });
      }
    }

    // بررسی آستانه حافظه بر اساس RSS
    const rssUsageRatio = currentUsage.rss / this.TOTAL_SYSTEM_MEMORY;
    if (rssUsageRatio > this.MEMORY_THRESHOLD) {
      console.warn('High memory usage detected:', {
        rssUsage: `${(rssUsageRatio * 100).toFixed(2)}%`,
        timestamp: new Date().toISOString()
      });
      
      this.emit('highMemoryUsage', {
        heapUsage: rssUsageRatio,
        timestamp: new Date().toISOString()
      });

      // اجرای cleanup اضطراری
      await this.emergencyCleanup();
    }

    this.lastMemoryUsage = currentUsage;
  }

  private async emergencyCleanup(): Promise<void> {
    console.log('Performing emergency cleanup...');
    
    // پاک کردن کامل cache
    this.cache.clear();
    
    // اجرای garbage collection
    if (global.gc) {
      global.gc();
    }

    // بررسی و بستن پردازش‌های اضافی Node.js
    if (process.platform === 'win32') {
      try {
        const { stdout } = await execAsync('wmic process where "name=\'node.exe\'" get ProcessId,WorkingSetSize /format:list');
        const processes = stdout.split('\n\n')
          .filter(p => p.trim())
          .map(p => {
            const pid = p.match(/ProcessId=(\d+)/)?.[1];
            const memory = p.match(/WorkingSetSize=(\d+)/)?.[1];
            return { pid, memory: memory ? parseInt(memory) : 0 };
          })
          .filter(p => p.pid && p.memory > 200 * 1024 * 1024); // بیش از 200MB

        for (const process of processes) {
          if (process.pid && process.pid !== process.pid.toString()) {
            console.log(`Terminating high memory process: ${process.pid}`);
            await execAsync(`taskkill /F /PID ${process.pid}`);
          }
        }
      } catch (error) {
        console.error('Error during emergency cleanup:', error);
      }
    }

    this.emit('emergencyCleanup', {
      timestamp: new Date().toISOString(),
      memoryUsage: process.memoryUsage()
    });
  }

  public set(key: string, value: any, ttl: number = 1800000): void { // کاهش TTL به 30 دقیقه
    if (this.cache.size >= this.MAX_CACHE_SIZE) {
      this.cleanup();
    }

    this.cache.set(key, {
      value,
      expires: Date.now() + ttl
    });
  }

  public get(key: string): any {
    const item = this.cache.get(key);
    if (!item) return null;

    if (Date.now() > item.expires) {
      this.cache.delete(key);
      return null;
    }

    return item.value;
  }

  public cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now > item.expires) {
        this.cache.delete(key);
      }
    }

    if (global.gc) {
      global.gc();
    }

    this.emit('cleanup', {
      cacheSize: this.cache.size,
      timestamp: new Date().toISOString()
    });
  }

  public getStats(): {
    cacheSize: number;
    maxCacheSize: number;
    memoryUsage: NodeJS.MemoryUsage;
    memoryLeakDetected: boolean;
    totalSystemMemory: number;
  } {
    return {
      cacheSize: this.cache.size,
      maxCacheSize: this.MAX_CACHE_SIZE,
      memoryUsage: process.memoryUsage(),
      memoryLeakDetected: this.memoryLeakDetected,
      totalSystemMemory: this.TOTAL_SYSTEM_MEMORY
    };
  }
}

export const memoryManager = MemoryManager.getInstance(); 