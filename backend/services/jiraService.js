import axios from 'axios';

const createJiraTicket = async (summary, priority, templateTitle, userEmail, link) => {
  const JIRA_URL = process.env.JIRA_URL;
  const JIRA_EMAIL = process.env.JIRA_EMAIL;
  const JIRA_API_TOKEN = process.env.JIRA_API_TOKEN;
  const JIRA_KEY = process.env.JIRA_KEY;

  if (!JIRA_URL || !JIRA_EMAIL || !JIRA_API_TOKEN || !JIRA_KEY) {
    throw new Error('Missing required Jira configuration');
  }

  if (!summary || !priority) {
    throw new Error('Summary and priority are required');
  }

  const ticketData = {
    fields: {
      project: {
        key: JIRA_KEY, 
      },
      summary,
      description: {
        version: 1,
        type: 'doc',
        content: [
          {
            type: 'paragraph',
            content: [
              {
                type: 'text',
                text: `Reported by: ${userEmail}\nTemplate: ${templateTitle || 'N/A'}\nLink: ${link || 'N/A'}`,
              },
            ],
          },
        ],
      },
      issuetype: {
        name: 'Task', 
      },
      priority: {
        name: priority,
      },
    },
  };

  try {
    console.log('Making Jira API request:', {
      url: `${JIRA_URL}/rest/api/3/issue`,
      data: ticketData
    });

    const response = await axios.post(`${JIRA_URL}/rest/api/3/issue`, ticketData, {
      auth: {
        username: JIRA_EMAIL,
        password: JIRA_API_TOKEN
      },
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json'
      }
    });

    console.log('Jira API response:', response.data);
    return response.data;
  } catch (error) {
    console.error('Jira API Error:', {
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message
    });
    throw error;
  }
};

export default createJiraTicket;