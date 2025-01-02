import React from 'react';

const TemplateStats = ({ data, forms, template }) => {
  console.log('TemplateStats received data:', { data, forms, template });

  return (
    <div className="bg-cyber-gray rounded-xl p-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-[#1A1B1F] p-6 rounded-lg border border-cyber-purple/30">
          <h3 className="text-gray-400 mb-2 text-sm">Total Submissions</h3>
          <p className="text-3xl font-bold text-cyber-pink">
            {data?.totalSubmissions || forms.length}
          </p>
        </div>

        <div className="bg-[#1A1B1F] p-6 rounded-lg border border-cyber-purple/30">
          <h3 className="text-gray-400 mb-2 text-sm">Completion Rate</h3>
          <p className="text-3xl font-bold text-cyber-purple">
            {data?.completionRate || '0.0'}%
          </p>
        </div>

        <div className="bg-[#1A1B1F] p-6 rounded-lg border border-cyber-purple/30">
          <h3 className="text-gray-400 mb-2 text-sm">Avg. Completion Time</h3>
          <p className="text-3xl font-bold text-cyber-pink">
            {data?.avgCompletionTime || 'N/A'}
          </p>
        </div>

        <div className="bg-[#1A1B1F] p-6 rounded-lg border border-cyber-purple/30">
          <h3 className="text-gray-400 mb-2 text-sm">Last Submission</h3>
          <p className="text-3xl font-bold text-cyber-purple">
            {forms.length > 0 
              ? new Date(forms[0].submittedAt).toLocaleDateString()
              : 'N/A'
            }
          </p>
        </div>
      </div>

      <div className="mt-8">
        <h3 className="text-xl font-bold mb-6 text-cyber-pink">Question Statistics</h3>
        <div className="space-y-6">
          {template.questions.map((question, index) => {
            const questionStats = data?.questionStats?.[question._id];
            return (
              <div 
                key={question._id} 
                className="bg-[#1A1B1F] p-6 rounded-lg border border-cyber-purple/30"
              >
                <h4 className="text-lg font-medium mb-4 text-gray-300">
                  {index + 1}. {question.text}
                </h4>
                <div className="text-gray-400">
                  <p className="mb-2">
                    Response Rate: 
                    <span className="text-cyber-pink ml-2">
                      {questionStats?.responseRate || '0.0'}%
                    </span>
                  </p>
                  <p>
                    Common Answers:
                    <span className="text-cyber-purple ml-2">
                      {questionStats?.commonAnswers?.join(', ') || 'No data'}
                    </span>
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TemplateStats; 