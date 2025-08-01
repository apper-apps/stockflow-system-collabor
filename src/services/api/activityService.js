import activitiesData from "@/services/mockData/activities.json";

// Simulate API delay
const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

class ActivityService {
  async getRecentActivities(limit = 10) {
    await delay(400);
    
    // Simulate potential API errors
    if (Math.random() < 0.05) {
      throw new Error("Failed to fetch recent activities");
    }
    
    // Sort by timestamp (most recent first) and limit results
    const sortedActivities = [...activitiesData]
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, limit);
    
    return sortedActivities;
  }

  async getActivityById(id) {
    await delay(200);
    
    const activity = activitiesData.find(item => item.Id === parseInt(id));
    if (!activity) {
      throw new Error(`Activity with ID ${id} not found`);
    }
    
    return { ...activity };
  }

  async addActivity(activityData) {
    await delay(300);
    
    // Find highest existing ID and add 1
    const maxId = Math.max(...activitiesData.map(item => item.Id));
    const newActivity = {
      Id: maxId + 1,
      ...activityData,
      timestamp: new Date().toISOString()
    };
    
    // In a real app, this would persist to backend
    activitiesData.push(newActivity);
    
    return { ...newActivity };
  }
}

export default new ActivityService();