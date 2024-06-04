export interface PageUpdateCheckerOptions {
  url?: string;
  interval?: number;
  isUpdateAvailable?: (currentHtml: string, newHtml: string) => boolean;
  onUpdateAvailable?: () => void;
  onError?: (error: Error) => void;
}

const defaultOptions: PageUpdateCheckerOptions = {
  url: '',
  interval: 1000 * 60 * 5, // 5 minutes
  isUpdateAvailable: (currentHtml, newHtml) => currentHtml !== newHtml,
  onUpdateAvailable: () => console.log('Update available'),
  onError: error => console.error(error),
};

class PageUpdateChecker {
  private readonly options: PageUpdateCheckerOptions;
  private intervalId: number | null = null;
  private documentElement: HTMLElement;
  private isIgnoreThisTime = false;

  constructor(options: PageUpdateCheckerOptions) {
    this.options = { ...defaultOptions, ...options };
    this.documentElement = document.documentElement;
  }

  static run(options: PageUpdateCheckerOptions) {
    const checker = new PageUpdateChecker(options);
    checker.start();
    return checker;
  }

  start() {
    const { interval, url, isUpdateAvailable, onUpdateAvailable, onError } = this.options;
    const _url = url || '/index.html';
    this.intervalId = window.setInterval(() => {
      if (this.isIgnoreThisTime) return;

      fetch(_url)
        .then(response => response.text())
        .then(newHtml => {
          if (isUpdateAvailable?.(this.documentElement.innerHTML, newHtml)) {
            onUpdateAvailable?.call(this);
          }
        })
        .catch(error => {
          onError?.(error);
          this.ignore();
        });
    }, interval);
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
