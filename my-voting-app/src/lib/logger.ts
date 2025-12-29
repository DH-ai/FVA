// Backend simulation logger utility
// Provides styled console output to simulate API calls and backend operations

type LogLevel = 'request' | 'response' | 'success' | 'error' | 'info' | 'warning';

interface LogStyles {
  [key: string]: string;
}

const styles: LogStyles = {
  request: 'background: #2563eb; color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold;',
  response: 'background: #7c3aed; color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold;',
  success: 'background: #16a34a; color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold;',
  error: 'background: #dc2626; color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold;',
  info: 'background: #0891b2; color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold;',
  warning: 'background: #ca8a04; color: white; padding: 2px 8px; border-radius: 4px; font-weight: bold;',
};

const dataStyle = 'color: #94a3b8; font-size: 11px;';
const urlStyle = 'color: #60a5fa; font-weight: bold;';
const timestampStyle = 'color: #64748b; font-size: 10px;';

class APILogger {
  private static getTimestamp(): string {
    return new Date().toISOString();
  }

  private static formatDuration(ms: number): string {
    return `${ms}ms`;
  }

  static request(method: string, endpoint: string, data?: object): number {
    const timestamp = this.getTimestamp();
    const requestId = Date.now();
    
    console.group(`%c ${method} %c ${endpoint}`, styles.request, urlStyle);
    console.log(`%c[${timestamp}]`, timestampStyle);
    if (data) {
      console.log('%cRequest Payload:', dataStyle);
      console.log(data);
    }
    console.groupEnd();
    
    return requestId;
  }

  static response(endpoint: string, statusCode: number, data?: object, duration?: number): void {
    const timestamp = this.getTimestamp();
    const isSuccess = statusCode >= 200 && statusCode < 300;
    const style = isSuccess ? styles.success : styles.error;
    
    console.group(`%c ${statusCode} %c ${endpoint}`, style, urlStyle);
    console.log(`%c[${timestamp}]${duration ? ` (${this.formatDuration(duration)})` : ''}`, timestampStyle);
    if (data) {
      console.log('%cResponse Data:', dataStyle);
      console.log(data);
    }
    console.groupEnd();
  }

  static info(message: string, data?: object): void {
    console.group(`%c INFO %c ${message}`, styles.info, 'color: #e2e8f0;');
    console.log(`%c[${this.getTimestamp()}]`, timestampStyle);
    if (data) {
      console.log(data);
    }
    console.groupEnd();
  }

  static warning(message: string, data?: object): void {
    console.group(`%c WARNING %c ${message}`, styles.warning, 'color: #fbbf24;');
    console.log(`%c[${this.getTimestamp()}]`, timestampStyle);
    if (data) {
      console.log(data);
    }
    console.groupEnd();
  }

  static error(message: string, error?: unknown): void {
    console.group(`%c ERROR %c ${message}`, styles.error, 'color: #f87171;');
    console.log(`%c[${this.getTimestamp()}]`, timestampStyle);
    if (error) {
      console.error(error);
    }
    console.groupEnd();
  }

  static success(message: string, data?: object): void {
    console.group(`%c SUCCESS %c ${message}`, styles.success, 'color: #4ade80;');
    console.log(`%c[${this.getTimestamp()}]`, timestampStyle);
    if (data) {
      console.log(data);
    }
    console.groupEnd();
  }

  // Simulated API calls with logging
  static async simulateAPICall<T>(
    method: string,
    endpoint: string,
    requestData: object | null,
    responseData: T,
    delay: number = 1000,
    shouldSucceed: boolean = true
  ): Promise<T> {
    const startTime = Date.now();
    this.request(method, endpoint, requestData || undefined);
    
    await new Promise(resolve => setTimeout(resolve, delay));
    
    const duration = Date.now() - startTime;
    const statusCode = shouldSucceed ? 200 : 401;
    
    this.response(endpoint, statusCode, responseData as object, duration);
    
    if (!shouldSucceed) {
      throw new Error('API call failed');
    }
    
    return responseData;
  }
}

export default APILogger;
export { APILogger };
