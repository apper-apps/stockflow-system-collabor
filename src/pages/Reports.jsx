import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import useInterval from "@/hooks/useInterval";
import { exportReportsData, getAllProducts, getLowStockAlerts, getStockAnalytics } from "@/services/api/productService";
import ApperIcon from "@/components/ApperIcon";
import MetricCard from "@/components/molecules/MetricCard";
import Loading from "@/components/ui/Loading";
import Button from "@/components/atoms/Button";
import Card from "@/components/atoms/Card";
import Categories from "@/pages/Categories";
import Dashboard from "@/pages/Dashboard";
function Reports() {
  const [allProducts, setAllProducts] = useState([]);
  const [alerts, setAlerts] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [isUpdating, setIsUpdating] = useState(false);

  async function loadData(showLoadingState = true) {
    try {
      if (showLoadingState) {
        setLoading(true);
      } else {
        setIsUpdating(true);
      }
const [products, stockAlerts, stockAnalytics] = await Promise.all([
        getAllProducts(),
        getLowStockAlerts(),
        getStockAnalytics()
      ]);

      setAllProducts(products);
      setAlerts(stockAlerts);
      setAnalytics(stockAnalytics);
    } catch (error) {
      console.error('Failed to load reports data:', error);
      if (showLoadingState) {
        toast.error('Failed to load reports data');
      }
    } finally {
      if (showLoadingState) {
        setLoading(false);
      } else {
        setIsUpdating(false);
      }
    }
}

  // Real-time analytics updates every 45 seconds
  useInterval(() => {
    if (!loading && activeTab === 'analytics') {
      loadData(false);
    }
  }, 45000);

useEffect(() => {
    loadData();
  }, []);

  const handleExportReports = () => {
    try {
      exportReportsData(allProducts, alerts, analytics);
      toast.success('Reports exported successfully');
    } catch (error) {
      toast.error('Failed to export reports');
    }
  };

  const getUrgencyBadge = (urgency) => {
    const badges = {
      critical: { bg: 'bg-red-100', text: 'text-red-800', border: 'border-red-200', label: 'Critical' },
      high: { bg: 'bg-amber-100', text: 'text-amber-800', border: 'border-amber-200', label: 'High' },
      medium: { bg: 'bg-blue-100', text: 'text-blue-800', border: 'border-blue-200', label: 'Medium' },
      low: { bg: 'bg-slate-100', text: 'text-slate-800', border: 'border-slate-200', label: 'Low' }
    };
    
    const badge = badges[urgency] || badges.low;
    return (
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${badge.bg} ${badge.text} ${badge.border}`}>
        {badge.label}
      </span>
    );
  };

  if (loading) {
    return <Loading />;
  }

  const tabs = [
    { id: 'overview', label: 'Overview', icon: 'BarChart3' },
    { id: 'low-stock', label: 'Low Stock Alerts', icon: 'AlertTriangle' },
    { id: 'analytics', label: 'Stock Analytics', icon: 'TrendingUp' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Reports & Analytics</h1>
          <p className="mt-2 text-slate-600">
            Comprehensive inventory insights and stock management analytics
          </p>
        </div>
        <div className="mt-4 sm:mt-0 flex items-center space-x-3">
          <Button 
            variant="outline" 
            onClick={handleExportReports}
            className="flex items-center space-x-2"
          >
            <ApperIcon name="Download" className="w-4 h-4" />
            <span>Export Reports</span>
          </Button>
        </div>
      </motion.div>

      {/* Tab Navigation */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
      >
        <div className="border-b border-slate-200">
          <nav className="-mb-px flex space-x-8">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
                }`}
              >
                <ApperIcon name={tab.icon} className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Overview Tab */}
      {activeTab === 'overview' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            <MetricCard
              title="Total Products"
              value={analytics?.totalProducts || 0}
              icon="Package"
              color="blue"
            />
            <MetricCard
              title="Low Stock Items"
              value={analytics?.lowStockCount || 0}
              icon="AlertTriangle"
              color="red"
            />
            <MetricCard
              title="Out of Stock"
              value={analytics?.outOfStockCount || 0}
              icon="XCircle"
              color="red"
            />
            <MetricCard
              title="Total Value"
              value={`$${(analytics?.totalValue || 0).toLocaleString()}`}
              icon="DollarSign"
              color="green"
            />
          </div>

<Card className="p-6">
            <h3 className="text-lg font-semibold text-slate-900 mb-4">Stock Distribution by Category</h3>
            <div className="space-y-4">
              {analytics?.categoryBreakdown?.map((category) => (
                <div key={category.name} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-4 h-4 bg-primary-500 rounded"></div>
                    <span className="text-slate-700">{category.name}</span>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-slate-600">{category.count} items</span>
                    <span className="text-sm font-medium text-slate-900">${category.value.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        </motion.div>
      )}

      {/* Low Stock Alerts Tab */}
      {activeTab === 'low-stock' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-slate-900">Low Stock Alerts Dashboard</h3>
<div className="flex items-center space-x-2 text-sm text-slate-600">
                <ApperIcon name="AlertTriangle" className="w-4 h-4" />
                <span>{alerts.length} items need attention</span>
              </div>
            </div>
            
            <div className="overflow-x-auto">
              <table className="min-w-full">
                <thead>
                  <tr className="border-b border-slate-200">
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Product</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Current Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Minimum Stock</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Urgency</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Suggested Reorder</th>
                    <th className="text-left py-3 px-4 font-medium text-slate-900">Location</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {alerts.map((alert, index) => (
                    <motion.tr
                      key={alert.Id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="hover:bg-slate-50"
                    >
                      <td className="py-3 px-4">
                        <div>
                          <div className="font-medium text-slate-900">{alert.name}</div>
                          <div className="text-sm text-slate-500">{alert.sku}</div>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-medium text-slate-900">{alert.currentStock}</span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-600">{alert.minimumStock}</span>
                      </td>
                      <td className="py-3 px-4">
                        {getUrgencyBadge(alert.urgency)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <span className="font-medium text-emerald-600">{alert.suggestedReorder}</span>
                          <span className="text-sm text-slate-500">units</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="text-slate-600">{alert.location}</span>
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
            
{alerts.length === 0 && (
              <div className="text-center py-8">
                <ApperIcon name="CheckCircle" className="w-12 h-12 text-emerald-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-slate-900 mb-2">All Stock Levels Good</h3>
                <p className="text-slate-600">No products are currently below minimum stock levels</p>
              </div>
            )}
          </Card>
        </motion.div>
      )}

      {/* Analytics Tab */}
      {activeTab === 'analytics' && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Stock Levels Distribution</h3>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 bg-emerald-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                    <span className="text-emerald-800 font-medium">In Stock</span>
                  </div>
<span className="text-emerald-900 font-semibold">{analytics?.inStockCount || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-amber-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                    <span className="text-amber-800 font-medium">Low Stock</span>
                  </div>
                  <span className="text-amber-900 font-semibold">{analytics?.lowStockCount || 0}</span>
                </div>
                <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                    <span className="text-red-800 font-medium">Out of Stock</span>
                  </div>
                  <span className="text-red-900 font-semibold">{analytics?.outOfStockCount || 0}</span>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-lg font-semibold text-slate-900 mb-4">Top Value Categories</h3>
              <div className="space-y-3">
                {analytics?.topValueCategories?.map((category, index) => (
                  <div key={category.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-6 h-6 bg-primary-100 text-primary-600 rounded-full flex items-center justify-center text-xs font-medium">
                        {index + 1}
                      </div>
                      <span className="text-slate-700">{category.name}</span>
                    </div>
                    <span className="font-medium text-slate-900">${category.value.toLocaleString()}</span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Reports;