/* eslint-disable @typescript-eslint/no-explicit-any */
import * as process from 'process';

export const ALL_LOG_LEVELS = 'INFO,DEBUG,WARN,ERROR';
type LogLevel = 'INFO' | 'DEBUG' | 'WARN' | 'ERROR';

const LOG_LEVELS: LogLevel[] = (process.env.ALLOWED_LOG_LEVELS || ALL_LOG_LEVELS).split(
	','
) as LogLevel[];

const ENABLED_LEVELS = new Set<LogLevel>(LOG_LEVELS);

function logger(method: 'log' | 'info' | 'debug' | 'warn' | 'error', level: LogLevel = 'INFO') {
	return (message?: unknown, ...optionalParams: unknown[]) => {
		if (ENABLED_LEVELS.has(level)) {
			if (typeof message === 'string') {
				console[method](`[${level}] ${message}`, ...optionalParams);
			} else {
				console[method](`[${level}]`, message, ...optionalParams);
			}
		}
	};
}

export const LogHelper = {
	log: logger('log'),
	info: logger('info'),
	debug: logger('debug', 'DEBUG'),
	warn: logger('warn', 'WARN'),
	error: logger('error', 'ERROR'),
};


// Stripe 

// pk_test_51L1gTuGsubZ6UQ3nKrIH1ZidUkur1ZL3KidOQYaShfH8GqUFiwoDexZ0EM1G8JjUHUFXsc1zoMySFGse8VYzOcC600dDYXENqF
// sk_test_51L1gTuGsubZ6UQ3naPc2DRjLAVxg0VJ7gtLjyGYjRR4UUBGIh2Cmhk0M4w6qFvrIKzzqQbz9cczbSx6KW7KxsvGV009GrC711d



// Coin base

// b691117b-1124-4771-a173-0f343cee4f66