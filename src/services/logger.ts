import { appendFile, mkdir } from 'fs/promises';
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
        const dirPath = join(process.cwd(), LOG_DIR);
        const logFile = join(dirPath, `${source}-error.log`);

        // Ensure logs directory exists
        await mkdir(dirPath, { recursive: true });

        await appendFile(logFile, logMessage, { flag: 'a' });
    } catch (writeError) {
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