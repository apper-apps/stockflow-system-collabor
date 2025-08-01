import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import useInterval from "@/hooks/useInterval";
import metricsService from "@/services/api/metricsService";
import activityService from "@/services/api/activityService";
import MetricCard from "@/components/molecules/MetricCard";
import RecentActivity from "@/components/organisms/RecentActivity";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);

  async function loadDashboardData(showLoadingState = true) {
    try {
      if (showLoadingState) {
        setLoading(true);
      } else {
        setIsUpdating(true);
      }
      setError(null);

      const [metricsData, activitiesData] = await Promise.all([
        metricsService.getMetrics(),
        activityService.getActivities()
      ]);

      setMetrics(metricsData);
      setActivities(activitiesData);
    } catch (err) {
console.error('Dashboard loading error:', err);
      setError(err.message);
      if (showLoadingState) {
        toast.error(`Failed to load dashboard: ${err.message}`);
      }
    } finally {
      if (showLoadingState) {
        setLoading(false);
      } else {
        setIsUpdating(false);
      }
    }
  }

  // Real-time updates every 30 seconds
  useInterval(() => {
    if (!loading && !error) {
      loadDashboardData(false);
    }
  }, 30000);

useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <Error message={error} onRetry={loadDashboardData} />;
  }

  if (!metrics) {
    return (
      <Empty
        title="No metrics available"
        description="Unable to load dashboard metrics at this time."
        action={loadDashboardData}
        actionLabel="Reload Dashboard"
        icon="BarChart3"
      />
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value);
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat('en-US').format(value);
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-primary-500 to-accent-500 rounded-2xl p-8 text-white"
      >
        <h2 className="text-3xl font-bold mb-2">Inventory Overview</h2>
        <p className="text-primary-100 text-lg">
          Monitor your stock levels and inventory performance in real-time
        </p>
      </motion.div>

      {/* Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <MetricCard
          title="Total Products"
          value={formatNumber(metrics.totalProducts)}
          icon="Package"
          trend="up"
          trendValue="+12.5%"
          colorScheme="blue"
          delay={0}
        />
        <MetricCard
          title="Low Stock Alerts"
          value={formatNumber(metrics.lowStockCount)}
          icon="AlertTriangle"
          trend="down"
          trendValue="-8.2%"
          colorScheme="red"
          delay={0.1}
        />
        <MetricCard
          title="Total Inventory Value"
          value={formatCurrency(metrics.totalValue)}
          icon="DollarSign"
          trend="up"
          trendValue="+15.7%"
          colorScheme="green"
          delay={0.2}
        />
        <MetricCard
          title="Recent Activity"
          value={formatNumber(metrics.recentActivityCount)}
          icon="Activity"
          trend="up"
          trendValue="+5.3%"
          colorScheme="purple"
          delay={0.3}
        />
      </div>

      {/* Recent Activity */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        {activities.length > 0 ? (
          <RecentActivity activities={activities} />
        ) : (
          <Empty
            title="No recent activity"
            description="There hasn't been any inventory activity recently."
            icon="Activity"
          />
        )}
      </motion.div>
    </div>
  );
};

export default Dashboard;