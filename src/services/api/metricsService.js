import metricsData from "@/services/mockData/metrics.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MetricsService {
  constructor() {
    this.baseMetrics = { ...metricsData.inventoryMetrics };
  }

  async getMetrics() {
    await delay(300);
    
    // Simulate potential API errors
    if (Math.random() < 0.05) {
      throw new Error("Failed to fetch inventory metrics");
    }
    
    // Simulate real-time data changes
    const variance = 0.05; // 5% variance
    const updatedMetrics = {
      ...this.baseMetrics,
      totalProducts: Math.max(1000, this.baseMetrics.totalProducts + Math.floor((Math.random() - 0.5) * 50)),
      lowStockCount: Math.max(0, this.baseMetrics.lowStockCount + Math.floor((Math.random() - 0.5) * 6)),
      totalValue: Math.max(500000, this.baseMetrics.totalValue + Math.floor((Math.random() - 0.5) * 50000)),
      recentActivityCount: Math.max(50, this.baseMetrics.recentActivityCount + Math.floor((Math.random() - 0.5) * 20)),
      lastUpdated: new Date().toISOString()
    };
    
    // Update base metrics for next call
    this.baseMetrics = { ...updatedMetrics };
    
    return updatedMetrics;
  }

  async updateMetrics(updates) {
    await delay(200);
    
    // In a real app, this would update the backend
    const currentMetrics = { ...metricsData.inventoryMetrics };
    const updatedMetrics = { 
      ...currentMetrics, 
      ...updates,
      lastUpdated: new Date().toISOString()
    };
    
    return updatedMetrics;
  }
}

export default new MetricsService();