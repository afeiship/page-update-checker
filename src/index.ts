export interface PageUpdateCheckerOptions {
  url?: string;
  interval?: number;
  isUpdateAvailable?: (latestHtml: string, newHtml: string) => boolean;
  onUpdateAvailable?: (ctx: PageUpdateChecker) => void;
  onError?: (error: Error) => void;
}

const defaultOptions: PageUpdateCheckerOptions = {
  url: '',
  interval: 1000 * 60 * 5, // 5 minutes
  isUpdateAvailable: (latestHtml, newHtml) => latestHtml !== newHtml,
  onUpdateAvailable: (ctx) => console.log('Update available'),
  onError: error => console.error(error),
};

class PageUpdateChecker {
  private readonly options: PageUpdateCheckerOptions;
  private intervalId: number | null = null;
  private isIgnoreThisTime = false;
  private latestHtml = '';

  constructor(options: PageUpdateCheckerOptions) {
    this.options = { ...defaultOptions, ...options };
    localStorage.setItem('page_checker_interval', '0');
  }

  static run(options: PageUpdateCheckerOptions) {
    const checker = new PageUpdateChecker(options);
    checker.start();
    return checker;
  }

  reset() {
    this.latestHtml = '';
    localStorage.setItem('page_checker_interval', '0');
    this.isIgnoreThisTime = false;
    this.stop();
  }

  start() {
    const { interval, url, isUpdateAvailable, onUpdateAvailable, onError } = this.options;
    const _url = url || '/index.html';
    const _interval = parseInt(localStorage.getItem('page_checker_interval') || '0') || interval!;
    if (_interval <= 0) return;

    this.intervalId = window.setInterval(() => {
      if (this.isIgnoreThisTime) return;

      fetch(_url)
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
