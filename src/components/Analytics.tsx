import React from 'react';
import { useAppContext } from '../context/AppContext';
import { Clock, BarChart2 } from 'lucide-react';

const Analytics: React.FC = () => {
  const { screenshots } = useAppContext();

  // Calculate statistics
  const totalScreenshots = screenshots.length;
  const lastScreenshot = screenshots[0]?.timestamp || 'No screenshots yet';

  return (
    <div className="space-y-6">
      {/* Screenshot Statistics */}
      <div className="bg-white/5 backdrop-blur-sm rounded-xl p-6">
        <h3 className="text-xl font-semibold mb-4">Screenshot Statistics</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <BarChart2 className="w-6 h-6 text-blue-400" />
              <div>
                <p className="text-sm text-gray-400">Total Screenshots</p>
                <p className="text-xl font-semibold">{totalScreenshots}</p>
              </div>
            </div>
          </div>
          <div className="bg-white/5 rounded-lg p-4">
            <div className="flex items-center space-x-3">
              <Clock className="w-6 h-6 text-green-400" />
              <div>
                <p className="text-sm text-gray-400">Last Screenshot</p>
                <p className="text-xl font-semibold">{new Date(lastScreenshot).toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Analytics;