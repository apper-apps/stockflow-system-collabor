import metricsData from "@/services/mockData/metrics.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class MetricsService {
  async getMetrics() {
    await delay(300);
    
    // Simulate potential API errors
    if (Math.random() < 0.05) {
      throw new Error("Failed to fetch inventory metrics");
    }
    
    return { ...metricsData.inventoryMetrics };
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