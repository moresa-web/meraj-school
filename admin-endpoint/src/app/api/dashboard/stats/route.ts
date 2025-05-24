import { NextResponse } from 'next/server'
import { startOfMonth, endOfMonth, subMonths } from 'date-fns'
import os from 'os'
import { exec } from 'child_process'
import { promisify } from 'util'

const execAsync = promisify(exec)

async function getSystemStatus() {
  try {
    console.log('Starting system status check...')
    
    // دریافت اطلاعات CPU
    const cpuLoadAvg = os.loadavg()
    const cpuCount = os.cpus().length
    const cpuUsage = cpuLoadAvg[0] / cpuCount * 100
    
    console.log('CPU Info:', {
      loadAvg: cpuLoadAvg,
      cpuCount,
      calculatedUsage: cpuUsage
    })

    // دریافت اطلاعات حافظه
    const totalMem = os.totalmem()
    const freeMem = os.freemem()
    const memoryUsage = ((totalMem - freeMem) / totalMem) * 100
    
    console.log('Memory Info:', {
      totalMem: `${Math.round(totalMem / (1024 * 1024 * 1024))}GB`,
      freeMem: `${Math.round(freeMem / (1024 * 1024 * 1024))}GB`,
      calculatedUsage: memoryUsage
    })

    // دریافت اطلاعات فضای ذخیره‌سازی
    let storageUsage = 0
    try {
      if (process.platform === 'win32') {
        console.log('Running on Windows, checking disk space...')
        const { stdout } = await execAsync('wmic logicaldisk get size,freespace,caption')
        console.log('Windows Storage Command Output:', stdout)
        
        const lines = stdout.trim().split('\n').slice(1)
        let totalSize = 0
        let totalFree = 0
        
        for (const line of lines) {
          const parts = line.trim().split(/\s+/)
          if (parts.length >= 3) {
            const [caption, freeSpace, size] = parts
            if (caption && size && freeSpace) {
              const sizeNum = parseInt(size)
              const freeNum = parseInt(freeSpace)
              if (!isNaN(sizeNum) && !isNaN(freeNum)) {
                totalSize += sizeNum
                totalFree += freeNum
                console.log('Disk Info:', {
                  drive: caption,
                  size: `${Math.round(sizeNum / (1024 * 1024 * 1024))}GB`,
                  free: `${Math.round(freeNum / (1024 * 1024 * 1024))}GB`
                })
              }
            }
          }
        }
        
        if (totalSize > 0) {
          storageUsage = ((totalSize - totalFree) / totalSize) * 100
          console.log('Storage Calculation:', {
            totalSize: `${Math.round(totalSize / (1024 * 1024 * 1024))}GB`,
            totalFree: `${Math.round(totalFree / (1024 * 1024 * 1024))}GB`,
            calculatedUsage: storageUsage
          })
        } else {
          console.warn('No valid disk information found')
          storageUsage = 0
        }
      } else {
        console.log('Running on Linux/Unix, checking disk space...')
        const { stdout } = await execAsync('df -k /')
        console.log('Linux Storage Command Output:', stdout)
        
        const lines = stdout.trim().split('\n')
        if (lines.length > 1) {
          const parts = lines[1].trim().split(/\s+/)
          if (parts.length >= 3) {
            const [, size, used] = parts
            if (size && used) {
              const sizeNum = parseInt(size)
              const usedNum = parseInt(used)
              if (!isNaN(sizeNum) && !isNaN(usedNum) && sizeNum > 0) {
                storageUsage = (usedNum / sizeNum) * 100
                console.log('Storage Calculation:', {
                  size: `${Math.round(sizeNum / (1024 * 1024))}GB`,
                  used: `${Math.round(usedNum / (1024 * 1024))}GB`,
                  calculatedUsage: storageUsage
                })
              }
            }
          }
        }
      }
    } catch (storageError) {
      console.error('Error getting storage info:', storageError)
      storageUsage = 0
    }

    // اطمینان از اینکه مقادیر در محدوده معتبر هستند
    const clampValue = (value: number) => Math.min(Math.max(value, 0), 100)

    const finalValues = {
      cpu: `${Math.round(clampValue(cpuUsage))}%`,
      memory: `${Math.round(clampValue(memoryUsage))}%`,
      storage: `${Math.round(clampValue(storageUsage))}%`
    }

    console.log('Final System Status Values:', finalValues)
    return finalValues
  } catch (error) {
    console.error('Error getting system status:', error)
    return {
      cpu: '0%',
      memory: '0%',
      storage: '0%'
    }
  }
}

export async function GET() {
  try {
    console.log('Dashboard stats API called')
    
    const now = new Date()
    const currentMonthStart = startOfMonth(now)
    const currentMonthEnd = endOfMonth(now)
    const lastMonthStart = startOfMonth(subMonths(now, 1))
    const lastMonthEnd = endOfMonth(subMonths(now, 1))

    // دریافت وضعیت واقعی سیستم
    console.log('Fetching system status...')
    const systemStatus = await getSystemStatus()
    console.log('System status received:', systemStatus)

    // دریافت آمار واقعی از API
    const response = await fetch('http://localhost:5000/api/dashboard/stats')
    const stats = await response.json()

    console.log('Sending dashboard stats response:', JSON.stringify(stats, null, 2))
    const apiResponse = NextResponse.json(stats)
    console.log('Response headers:', Object.fromEntries(apiResponse.headers.entries()))
    return apiResponse
  } catch (error) {
    console.error('Error in dashboard stats API:', error)
    return NextResponse.json(
      { error: 'خطا در دریافت آمار داشبورد' },
      { status: 500 }
    )
  }
} 