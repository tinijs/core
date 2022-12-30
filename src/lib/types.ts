export interface ServiceProvider {
  provider: () => Promise<any>;
  deps?: string[];
}
