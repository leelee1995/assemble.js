import { appendFile } from 'fs/promises';
import { join } from 'path';

const LOG_DIR = 'logs';

const formatError = (error: Error | unknown): string => {
    const timestamp = new Date().toISOString();
    if (error instanceof Error) {
        return `[${timestamp}] ${error.name}: ${error.message}\nStack: ${error.stack}\n\n`;
    }
    return `[${timestamp}] Unknown Error: ${String(error)}\n\n`;
};

export const logError = async (error: Error | unknown, source: string = 'app'): Promise<void> => {
    try {
        const logMessage = formatError(error);
        const logFile = join(process.cwd(), LOG_DIR, `${source}-error.log`);
        
        await appendFile(logFile, logMessage, { flag: 'a' });
    } catch (writeError) {
        // Fallback to console if file writing fails
        console.error('Failed to write to log file:', writeError);
        console.error('Original error:', error);
    }
};

// Handle uncaught exceptions
process.on('uncaughtException', (error) => {
    logError(error, 'uncaught')
        .finally(() => process.exit(1));
});

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason) => {
    logError(reason, 'unhandled-promise')
        .finally(() => process.exit(1));
});