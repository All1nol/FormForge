import React, { useState, useEffect } from 'react';
import api from '../../services/api';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Bar } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const ResultsAggregation = ({ templateId }) => {
  const [aggregatedData, setAggregatedData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchAggregation = async () => {
      try {
        const response = await api.getTemplateAggregation(templateId);
        setAggregatedData(response.data);
      } catch (err) {
        setError('Failed to load aggregated results');
      } finally {
        setLoading(false);
      }
    };

    fetchAggregation();
  }, [templateId]);

  const renderQuestionData = (data) => {
    if (data.noData) {
      return (
        <div className="text-gray-500 italic">
          No responses received for this question yet
        </div>
      );
    }

    if (data.type === 'number') {
      return (
        <div className="grid grid-cols-3 gap-4 text-center">
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Average</div>
            <div className="text-lg font-semibold text-blue-600">
              {Number(data.average).toFixed(2)}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Min</div>
            <div className="text-lg font-semibold text-blue-600">
              {data.min}
            </div>
          </div>
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="text-sm text-gray-600">Max</div>
            <div className="text-lg font-semibold text-blue-600">
              {data.max}
            </div>
          </div>
        </div>
      );
    }

    if (data.frequencies && Object.keys(data.frequencies).length > 0) {
      return (
        <div className="h-64">
          <Bar
            data={{
              labels: Object.keys(data.frequencies),
              datasets: [{
                label: 'Responses',
                data: Object.values(data.frequencies),
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
                borderColor: 'rgba(59, 130, 246, 1)',
                borderWidth: 1
              }]
            }}
            options={{
              responsive: true,
              maintainAspectRatio: false,
              plugins: {
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1
                  }
                }
              }
            }}
          />
        </div>
      );
    }

    return (
      <div className="text-gray-500 italic">
        No analyzable data available for this question type
      </div>
    );
  };

  if (loading) return (
    <div className="flex justify-center items-center p-8">
      <div className="text-gray-600">Loading analysis...</div>
    </div>
  );

  if (error) return (
    <div className="p-4 bg-red-50 text-red-600 rounded-lg">
      {error}
    </div>
  );

  if (!aggregatedData || Object.keys(aggregatedData).length === 0) {
    return (
      <div className="p-4 bg-gray-50 text-gray-600 rounded-lg">
        No responses available for analysis yet.
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-900">Response Analysis</h3>
      {Object.entries(aggregatedData).map(([questionId, data]) => (
        <div key={questionId} className="bg-white rounded-lg shadow p-6">
          <h4 className="font-medium text-gray-900 mb-4">{data.questionText}</h4>
          {renderQuestionData(data)}
          <div className="mt-2 text-sm text-gray-500">
            Total responses: {data.count || 0}
          </div>
        </div>
      ))}
    </div>
  );
};

export default ResultsAggregation;