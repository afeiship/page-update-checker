export interface PageUpdateCheckerOptions {
  url?: string;
  interval?: number;
  storeKey?: string;
  isUpdateAvailable?: (latestHtml: string, newHtml: string) => boolean;
  onUpdateAvailable?: (ctx: PageUpdateChecker) => void;
  onError?: (error: Error) => void;
}

const defaultOptions: PageUpdateCheckerOptions = {
  url: '/index.html',
  interval: 1000 * 60 * 5, // 5 minutes
  storeKey: 'page_checker_interval',
  isUpdateAvailable: (latestHtml, newHtml) => latestHtml !== newHtml,
  onUpdateAvailable: (ctx) => console.log('Update available'),
  onError: error => console.error(error),
};

class PageUpdateChecker {
  private readonly options: PageUpdateCheckerOptions;
  private intervalId: number | null = null;
  private isIgnoreThisTime = false;
  private latestHtml = '';
  private storeKey: string;

  constructor(options: PageUpdateCheckerOptions) {
    this.options = { ...defaultOptions, ...options };
    this.storeKey = this.options.storeKey!;
    this.reset();
  }

  static run(options: PageUpdateCheckerOptions) {
    const checker = new PageUpdateChecker(options);
    checker.start();
    return checker;
  }

  reset() {
    const storedInterval = localStorage.getItem(this.storeKey);
    if (!storedInterval) localStorage.setItem(this.storeKey, '0');
    this.latestHtml = '';
    this.isIgnoreThisTime = false;
    this.stop();
  }

  start() {
    const { interval, url, isUpdateAvailable, onUpdateAvailable, onError } = this.options;
    const _interval = parseInt(localStorage.getItem(this.storeKey) || '0') || interval!;
    if (_interval <= 0) return;

    this.intervalId = window.setInterval(() => {
      if (this.isIgnoreThisTime) return;

      fetch(url!)
        .then(response => response.text())
        .then(newHtml => {
          if (this.latestHtml) {
            if (isUpdateAvailable?.(this.latestHtml, newHtml)) {
              onUpdateAvailable?.call(this, this);
            }
          }
          this.latestHtml = newHtml;
        })
        .catch(error => {
          onError?.(error);
          this.ignore();
        });
    }, _interval);
  }

  ignore() {
    this.isIgnoreThisTime = true;
  }

  stop() {
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export default PageUpdateChecker;
