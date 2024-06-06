export interface PageUpdateCheckerOptions {
  id?: string;
  url?: string;
  interval?: number;
  storeKey?: string;
  isUpdateAvailable?: (oldHtml: string, newHtml: string) => boolean;
  onUpdateAvailable?: (ctx: PageUpdateChecker) => void;
  onError?: (error: Error) => void;
}

const defaultOptions: PageUpdateCheckerOptions = {
  id: '@',
  url: '/index.html',
  interval: 1000 * 60 * 5, // 5 minutes
  storeKey: 'page_checker_interval',
  isUpdateAvailable: (oldHtml, newHtml) => oldHtml !== newHtml,
  onUpdateAvailable: (ctx) => console.log('Update available'),
  onError: error => console.error(error),
};

const EVENT_NS = 'page-update-checker';
const EVENT_IGNORE = `${EVENT_NS}:ignore`;

class PageUpdateChecker {
  private readonly options: PageUpdateCheckerOptions;
  private intervalId: number | null = null;
  private isIgnoreThisTime = false;
  private latestHtml = '';

  // event handlers
  private readonly eventIgnore: () => void;

  constructor(options: PageUpdateCheckerOptions) {
    this.options = { ...defaultOptions, ...options };
    this.reset();
    this.eventIgnore = this.ignore.bind(this);

    // attach events
    window.addEventListener(`${this.options.id}:${EVENT_IGNORE}`, this.eventIgnore);
  }

  static run(options: PageUpdateCheckerOptions) {
    const checker = new PageUpdateChecker(options);
    checker.start();
    return checker;
  }

  reset() {
    const { storeKey } = this.options;
    const storedInterval = localStorage.getItem(storeKey!);
    if (!storedInterval) localStorage.setItem(storeKey!, '0');
    this.latestHtml = '';
    this.isIgnoreThisTime = false;
    this.stop();
  }

  start() {
    const { interval, url, isUpdateAvailable, onUpdateAvailable, onError, storeKey } = this.options;
    const _interval = parseInt(localStorage.getItem(storeKey!) || '0') || interval!;
    if (_interval <= 0) return;

    this.intervalId = window.setInterval(() => {
      if (this.isIgnoreThisTime) return;

      fetch(url!)
        .then(response => response.text())
        .then(newHtml => {
          if (this.latestHtml && isUpdateAvailable?.(this.latestHtml, newHtml)) {
            onUpdateAvailable?.call(null, this);
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
    window.removeEventListener(`${this.options.id}:${EVENT_IGNORE}`, this.eventIgnore);
    if (this.intervalId) {
      window.clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }
}

export default PageUpdateChecker;
