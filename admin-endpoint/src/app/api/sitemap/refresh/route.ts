import { NextResponse } from 'next/server';
import { exec } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const execAsync = promisify(exec);

export async function POST() {
    try {
        // مسیر کامل به اسکریپت sitemap
        const scriptPath = path.join(process.cwd(), 'src', 'scripts', 'generate-sitemap.js');
        console.log('Script path:', scriptPath);
        
        // اجرای اسکریپت به‌روزرسانی sitemap
        const { stdout, stderr } = await execAsync(`node ${scriptPath}`);
        
        console.log('Script output:', stdout);
        
        if (stderr) {
            console.error('Error updating sitemap:', stderr);
            return NextResponse.json(
                { error: 'خطا در به‌روزرسانی sitemap' },
                { status: 500 }
            );
        }

        return NextResponse.json({ message: 'Sitemap با موفقیت به‌روزرسانی شد' });
    } catch (error) {
        console.error('Error updating sitemap:', error);
        return NextResponse.json(
            { error: 'خطا در به‌روزرسانی sitemap' },
            { status: 500 }
        );
    }
} 